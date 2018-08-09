import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Flex} from 'grid-styled';
import styled from 'styled-components';
import {Link} from 'react-router-dom'

export default class App extends Component {
	static contextTypes = {
		store: PropTypes.object,
		setStore: PropTypes.func,
	};

	constructor(props, context) {
		super(props);
	}

    render() {
        return (
	        <button><Link to='/game'>Начать игру</Link></button>
        );
    }
}
