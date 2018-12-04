# Bookstats

Shows detailed statistics about users reading habits by analyzing their exported database from [goodreads](https://goodreads.com).

Additional information (e.g. re-reading dates) can be added to the export file [using an external tool](https://github.com/PaulKlinger/Enhance-GoodReads-Export) and will be used in the statistics.
If the "private notes" field contains a line of the form "word count: 543" (i.e. matching the regex "^word count: (\d+)$") this will be used instead of the default estimate of multiplying the page count by 270.

Available at https://almoturg.com/bookstats