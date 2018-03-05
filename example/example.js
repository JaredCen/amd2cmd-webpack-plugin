import _ from 'lodash';
import $ from 'jquery';

class Example {
    constructor() {
        let arr = [1, 2, 3, 4, 5];
        arr = _.map(arr, (n) => {
            return n * 2;
        });
        console.log(arr);
    }
}

export default Example;