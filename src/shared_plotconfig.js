/**
 * Created by Paul on 2017-05-21.
 */

export default function regresssion_line(regression, min_x, max_x){
    return {
        type: 'scattergl',
            mode: 'lines',
        y: [regression.f(min_x), regression.f(max_x)],
        x: [min_x,max_x],
        name: `linear fit (R^2=${regression.R2.toPrecision(2)})`
    }
}