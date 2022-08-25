// Code here
const api_endpoint = 'http://localhost:3000';
let selectedBeer;
let beers;

function getBeer(id = 1) {
    return fetch(`${api_endpoint}/beers/${id}`).then(resp => resp.json());
}

function getAllBeers() {
    return fetch(`${api_endpoint}/beers`).then(resp => resp.json());
}

window.addEventListener('DOMContentLoaded', evt => {
    const mainElement = document.getElementsByTagName('main')[0];
    const beerListELement = document.querySelector('#beer-list');
    const beerDetailsElement = document.querySelector('.beer-details');
    const beerNameElement = document.querySelector('#beer-name');
    const beerImageElement = document.querySelector('#beer-image');
    const beerDescriptionElement = document.querySelector('#beer-description');
    const beerDescriptionForm = document.querySelector('#description-form');
    const beerReviewForm = document.querySelector('#review-form');
    const reviewListElement = document.querySelector('#review-list');
    const loader = document.createElement('div');
    loader.setAttribute('id', 'loader');
    loader.innerText = "loading..."

    const toggleProgress = () => {
        if (document.querySelector('#loader')) {
            document.querySelector('#loader').remove();
            beerDetailsElement.style.display = 'block';
        }
        else {
            mainElement.insertBefore(loader, beerDetailsElement);
            beerDetailsElement.style.display = 'none';
        }
    };

    const updateBeersList = () => {
        beerListELement.innerHTML = beers.map(beer => {
            return `<li>
                <a href="/index.html?id=${beer.id}" data-id="${beer.id}">${beer.name}</a>
            </li>`;
        }).join('');

        beerListELement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const beerId = e.target.dataset.id;
                selectedBeer = beers.find(beer => beer.id == beerId);
                updateBeerDetails(selectedBeer);
            })
        })
    };

    const updateBeerDetails = (beer) => {
        beerImageElement.setAttribute('src', beer.image_url);
        const spanLoader = document.createElement('div');
        spanLoader.id = "imageLoader";
        spanLoader.style.textAlign = "center";
        spanLoader.innerHTML = 'Loaing Iamage...';
        beerImageElement.parentNode.insertBefore(spanLoader, beerImageElement);
        beerDescriptionElement.innerHTML = beer.description;
        beerNameElement.innerHTML = beer.name;
        reviewListElement.innerHTML = beer.reviews.map(review => {
            return `<li>${review}</li>`;
        }).join('');

        try{
            beerDescriptionForm.removeEventListener('submit', submitDescription);
            beerReviewForm.removeEventListener('submit', submitReview);
        }
        catch(e){
            console.log(e)
        };
        beerDescriptionForm.addEventListener('submit', submitDescription);
        beerReviewForm.addEventListener('submit', submitReview);
    }

    /* Extract the query parameters from the URL */
    const queryParamsString = location.search;
    const queryParams = queryParamsString.substring(1, queryParamsString.length).split('&')
        .reduce((a, b) => { const [k, v] = b.split('='); a[k] = v; return a }, {});

    const beerId = queryParams.id || 1;


    /* initialize content */
    toggleProgress();
    getBeer(beerId).then(beer => {
        toggleProgress();
        selectedBeer = beer;
        updateBeerDetails(beer);
    });

    beerListELement.innerHTML = '';
    getAllBeers().then((response)=>{ beers=response;  updateBeersList();});

    beerImageElement.addEventListener('load', (evt) => {
        if (document.getElementById('imageLoader')) {
            document.getElementById('imageLoader').remove();
        }
    });

    function submitDescription(evt){
        evt.preventDefault();
        const form = evt.target;
        selectedBeer.description = form.querySelector('#description').value;
        const index = beers.findIndex(b=>b.id == selectedBeer.id);
        beers[index] = selectedBeer;
        form.querySelector('#description').value = '';
        beerDescriptionElement.innerHTML = selectedBeer.description;
        fetch(`${encodeURI}/beers/${selectedBeer.id}`, {
            method:'PUT', 
            body:JSON.stringify(selectedBeer),
            headers:{
                'Content-Type':'application/json'
            }
        })
    }
    
    function submitReview(evt){
        evt.preventDefault();
        const form = evt.target;
        selectedBeer.reviews.push(form.querySelector('#review').value);
        form.querySelector('#review').value = '';
        reviewListElement.innerHTML = selectedBeer.reviews.map(review => {
            return `<li>${review}</li>`;
        }).join('');
        fetch(`${encodeURI}/beers/${selectedBeer.id}`, {
            method:'PUT', 
            body:JSON.stringify(selectedBeer),
            headers:{
                'Content-Type':'application/json'
            }
        })
    }

});