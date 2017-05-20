/**
 * Created by Paul on 2017-05-20.
 */

import Papa from 'papaparse'

class Book {
    constructor(title, author, isbn, user_rating, average_rating) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.user_rating = user_rating;
        this.average_rating = average_rating;
    }
}

export default class Statistics {
    constructor(file) {
        this.file = file;
        this.data = [];
    }

    process_file() {
        let self = this;
        return new Promise( (resolve, reject) => {
            Papa.parse(this.file,
                {complete: (results) => {
                    results.data.forEach(columns => {
                        self.data.push(
                            new Book(
                                columns[1], // title
                                columns[2], // author
                                columns[6], // isbn ("ISBN13")
                                columns[7], // user_rating ("My Rating")
                                columns[8], // average_rating
                            ))
                    });
                    resolve();
                }});

        });
    }
}

