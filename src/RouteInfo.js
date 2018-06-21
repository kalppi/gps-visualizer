import React from 'react';

export default class RouteInfo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const style = {
			display: 'inline-block',
			verticalAlign: 'top',
			margin: 0,
			marginLeft: 10,
			listStyleType: 'none',
			cursor: 'pointer',
			padding: 0
		};

		return (
			<ol style={style}>
				{
					this.props.routes.routes.map((r, i) => (
						<li key={i} style={{fontFamily: 'Arial', fontSize: '10pt'}}>
							<div style={{display: 'inline-block', backgroundColor: r.color, width: 13, height: 13}}></div>
							<div style={{display: 'inline-block', marginLeft: 5}}>
								{r.toString()}
							</div>
						</li>
					))
				}
			</ol>
		);
	}
}