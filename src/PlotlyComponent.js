import React from 'react'

class PlotlyComponent extends React.Component {
    componentDidMount () {
        let {data, layout, config, plotly} = this.props;
        plotly.newPlot(this.container, data, layout, config);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.data !== this.props.data || prevProps.layout !== this.props.layout) {
            this.props.plotly.newPlot(this.container, this.props.data, this.props.layout);
        }
    }

    componentWillUnmount () {
        this.props.plotly.purge(this.container)
    }

    render () {
        let { plotly, data, layout, config, ...other } = this.props;
        return <div {...other} ref={(node) => this.container = node} />
    }
}

export default PlotlyComponent