const CUSTOM_SEARCH_API_KEY = 'AIzaSyA_fyWb8eLFSl9iLcisy8UqABZpIWDKKi4';
const SCRAPINGBEE_API_KEY = 'L8HUBO0FJBUONV0FZTZTRU8GSHU0HAG8YRU6HY792J6WL3ELZJCTQNT5F0MKG9OJLROIJKPM9BAVTBR6';

function search() {
    const searchQuery = document.getElementById('searchQuery').value;
    if (!searchQuery) {
        alert('Please enter a search query.');
        return;
    }

    const customSearchURL = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=57d9cb9ea128b4a4e&q=${encodeURIComponent(searchQuery)}`;

    fetch(customSearchURL)
        .then(response => response.json())
        .then(data => {
            const searchResults = data.items;
            if (searchResults && searchResults.length > 0) {
                // Extracting top 5 URLs from the search results
                const top5Urls = searchResults.slice(0, 5).map(item => item.link);

                // Using ScrapingBee API to get the text from each URL
                const promises = top5Urls.map(url => scrapeUrl(url));
                Promise.all(promises)
                    .then(texts => {
                        displayResults(texts);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

    function scrapeUrl(url) {
    const scrapingBeeURL = `https://app.scrapingbee.com/api/v1/?api_key=L8HUBO0FJBUONV0FZTZTRU8GSHU0HAG8YRU6HY792J6WL3ELZJCTQNT5F0MKG9OJLROIJKPM9BAVTBR6&url=${encodeURIComponent(url)}`;


    return fetch(scrapingBeeURL)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            doc.body.textContent;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(texts) {
    const resultElements = document.querySelectorAll('.results p');
    texts.forEach((text, index) => {
        resultElements[index].textContent = text;
    });
}