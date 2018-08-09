import React, {Component} from 'react';
import {Flex} from 'grid-styled';
import EndGame from './EndGame';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import shuffle from 'lodash/shuffle';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

class Game extends Component {
	static propTypes = {
		history: PropTypes.object,
		setScores: PropTypes.func,
	};


	state = {
		cards: [],
		isAllFliped: true,
		loading: true,
		clickedCards: [],
		scores: 0,
	};

	indexes = [];
	foundedCouples = 0;
	scores = 0;

	async componentDidMount() {
		const res = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52').then(response => {
			if (response.status >= 400) {
				throw new Error("Bad response from server");
			}
			return response.json();
		});
		const stateCards = [];
		const cards = get(res, 'cards', []);

		if (!cards.length) {
			throw new Error('Карт нет :(');
		}

		for (let i = 0; i < 9; i++) {
			let index = this.getRandom();
			stateCards.push(...[
				{
					...cards[index],
					isFounded: false,
					key: `${index} ${cards[index].suit} 1`,
				},
				{
					...cards[index],
					isFounded: false,
					key: `${index} ${cards[index].suit} 2`,
				},
			]);
		}

		this.setState({cards: shuffle(stateCards), loading: false}, () => setTimeout(() => this.setState({isAllFliped: false}), 5000));
	}

	handleClick(card) {
		const {clickedCards} = this.state;
		if (clickedCards.length < 2) {
			clickedCards.push(card);
			this.setState({clickedCards}, this.checkResult(clickedCards));
		}
	}

	endGame() {
		this.props.setScores(this.state.scores);
		this.props.history.push('/end');
	}

	checkResult(clickedCards) {
		const {cards} = this.state;
		if (clickedCards.length === 2) {
			if (clickedCards[0].code === clickedCards[1].code) {
				const c1 = cards.findIndex(c => clickedCards[0].key === c.key);
				const c2 = cards.findIndex(c => clickedCards[1].key === c.key);
				cards[c1] = {...cards[c1], isFounded: true};
				cards[c2] = {...cards[c2], isFounded: true};
				this.foundedCouples += 1;
				if (!cards.find(c => !c.isFounded)) {

				}
				setTimeout(() => this.setState(prev => ({cards, clickedCards: [], scores: prev.scores + (9 - this.foundedCouples) * 42}), () =>
					!cards.find(c => !c.isFounded) && this.endGame(), 1000));
			}
			setTimeout(() => this.setState(prev => ({clickedCards: [], scores: prev.scores - this.foundedCouples * 42})), 1000);
		}
	}

	getRandom() {
		const num = Math.floor(Math.random() * 52);
		if (!this.indexes.includes(num)) {
			this.indexes.push(num);
			return num;
		}
		return this.getRandom();
	}

	renderRows() {
		const rows = [];
		for (let i = 0; i < 3; i++) {
			rows.push(this.renderColumns(i));
		}
		return rows;
	}

	renderColumns(row) {
		const {cards} = this.state;
		const columns = [];
		for (let j = 0; j < 6; j++) {
			columns.push(this.renderCard(cards[row * 6 + j]));
		}
		return (
			<Flex key={row} flexDirection='column'>
				{columns}
			</Flex>
		);
	}

	renderCard(card) {
		const {isAllFliped} = this.state;
		return (card.isFounded ? <Flex style={{width: '108px', height: '150px'}} /> :
				isAllFliped || this.isCardFliped(card) ? <img key={card.key} style={{height: '150px', width: '108px'}} src={card.image} alt={`${card.value} of ${card.suit}`} />
					: <img onClick={() => this.handleClick(card)} key={Math.random()} style={{height: '150px', width: '108px'}} src={require('../images/notFlipedCard.png')} alt='not flipped' />
		);
	}

	isCardFliped(card) {
		const {clickedCards} = this.state;
		return !!clickedCards.find(c => c.key === card.key);
	}

	render() {
		const {loading, scores} = this.state;
		return (loading ? <Flex>loading</Flex> :
			<Flex p={10} justifyContent='space-between'>
				<Flex>{this.renderRows()}</Flex>
				<Flex>Ваш счет: {scores}</Flex>
			</Flex>
		);
	}
}

export default withRouter(Game);

