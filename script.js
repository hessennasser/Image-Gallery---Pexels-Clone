const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const SearchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeBtn = lightbox.querySelector(".uil-times");
const downloadImgBtn = lightbox.querySelector(".uil-import");


const apiKey = "mYG7zGwJHGp5rBnr9gwqWxgD7hSNrDn606hsYIxO49H6ypu53z8i9LlI";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgUrl) => {
    fetch(imgUrl).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(_ => alert("Filed to download image!"));
};

const showLightBox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector(".photographer span").innerHTML = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
};

const hideLightBox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";

};

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => {
        return `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <div class="uil uil-camera"></div>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation()">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`;
    }).join("");
};

const getImages = async (apiUrl) => {
    try {
        loadMoreBtn.innerText = "Loading...";
        loadMoreBtn.classList.add("disabled");
        const response = await fetch(apiUrl, {
            headers: { Authorization: apiKey }
        });
        const data = await response.json();
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    } catch {
        alert("Filed to load images!");
    }
};


const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
};

const loadSearchImages = (e) => {
    if (e.target.value === "") return;
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
};

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


loadMoreBtn.addEventListener("click", loadMoreImages);
SearchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));