// Code here
const api_endpoint = 'http://localhost:3000';

async function getBeer(id = 1){
    return await fetch(`${api_endpoint}/beers/${id}`).then(resp=>resp.json());
}

async function getAllBeers(){
    return await fetch(`${api_endpoint}/beers`).then(resp=>resp.json());
}

window.addEventListener('DOMContentLoaded', evt=>{
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

    const toggleProgress = ()=>{
        if(document.querySelector('#loader')){
            document.querySelector('#loader').remove();
            beerDetailsElement.style.display = 'block';
        }
        else{
            mainElement.insertBefore(loader, beerDetailsElement);
            beerDetailsElement.style.display = 'none';
        }
    };

    const updateBeersList = (beers)=>{
        beerListELement.innerHTML = beers.map(beer=>{
            return `<li>
                <a href="/index.html?id=${beer.id}">${beer.name}</a>
            </li>`;
        }).join('');
    };

    const updateBeerDetails = (beer)=>{
        beerImageElement.setAttribute('src', beer.image_url);
        beerDescriptionElement.innerHTML = beer.description;
        beerNameElement.innerHTML = beer.name;
        reviewListElement.innerHTML = beer.reviews.map(review=>{
            return `<li>${review}</li>`;
        }).join('');
        
        beerDescriptionForm.addEventListener('submit', evt=>{
            evt.preventDefault();
            const form = evt.target;
            beer.description = form.querySelector('#description').value;
            form.querySelector('#description').value = '';
            beerDescriptionElement.innerHTML = beer.description;
        });

        beerReviewForm.addEventListener('submit', evt=>{
            evt.preventDefault();
            const form = evt.target;
            beer.reviews.push(form.querySelector('#review').value);
            form.querySelector('#review').value = '';
            reviewListElement.innerHTML = beer.reviews.map(review=>{
                return `<li>${review}</li>`;
            }).join('');
        })
    }
    

    /* Extract the query parameters from the URL */
    const queryParamsString = location.search;
    const queryParams = queryParamsString.substring(1, queryParamsString.length).split('&')
                        .reduce((a, b)=>{ const [k, v] = b.split('='); a[k]=v; return a }, {});
    
    const beerId = queryParams.id || 1;


    /* initialize content */
    toggleProgress();
    getBeer(beerId).then(beer=>{
        toggleProgress();
        updateBeerDetails(beer);
    });

    beerListELement.innerHTML = '';
    getAllBeers().then(updateBeersList)
    
});