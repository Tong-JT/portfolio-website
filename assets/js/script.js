class Sidebar {
    constructor(header, items) {
        this.header = header;
        this.items = items;
    }
    initSection() {
        this.updateDom();
    }
    updateDom() {
    }
}

class CVMain {
    constructor(header, items) {
        this.header = header;
        this.items = items;
    }
    initSection() {
        this.updateDom();
    }
    updateDom() {
    }
}

class Card {
    constructor(id, title, description, image) {
        this.idCard = id;
        this.title = title;
        this.description = description;
        this.image = image;
    }
    initCard() {
        this.updateDom();
        this.activateListeners();
    }
    updateDom() {
    }
    activateListeners() {
        let $cardDom = $('#' + this.idCard);
        $cardDom.on('mouseover', () => {
            let $cardTitle = $cardDom.find('.card-title');
            let $cardDesc = $cardDom.find('.card-desc');
            let $cardMiddle = $cardDom.find('.card-mid');
            let $cardFooter = $cardDom.find('.card-footer');
            let cardMiddleHeight = $cardTitle.outerHeight(true) + $cardDesc.outerHeight(true)+ $cardFooter.outerHeight(true);
            $cardMiddle.css('height', cardMiddleHeight + 15 + 'px');
            console.log(cardMiddleHeight);
        });
        $cardDom.on('mouseout', () => {
            let $cardMiddle = $cardDom.find('.card-mid');
            $cardMiddle.css('height', '100px');
        });
    }
}

class Carousel {
    constructor(carouselText, eleRef) {
        this.carouselText = carouselText;
        this.eleRef = eleRef;
        this.currentIndex = 0;
    }
    async start() {
        while (true) {
            this.updateFontColor(this.carouselText[this.currentIndex].color);
            await this.typeSentence(this.carouselText[this.currentIndex].text);
            await this.waitForMs(1500);
            await this.deleteSentence();
            await this.waitForMs(500);
            this.currentIndex = (this.currentIndex + 1) % this.carouselText.length;
        }
    }
    async typeSentence(sentence, delay = 70) {
        const letters = sentence.split("");
        let i = 0;
        while (i < letters.length) {
            await this.waitForMs(delay);
            $(this.eleRef).append(letters[i]);
            i++;
        }
    }
    async deleteSentence() {
        let sentence = $(this.eleRef).html();
        const letters = sentence.split("");
        let i = 0;
        while (letters.length > 0) {
            await this.waitForMs(50);
            letters.pop();
            $(this.eleRef).html(letters.join(""));
        }
    }
    updateFontColor(color) {
        $(this.eleRef).css('color', color);
    }
    waitForMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


$(document).ready(async function () {

    const carouselText = [
        { text: "Software Development", color: "palevioletred" },
        { text: "Full Stack Development", color: "salmon" },
        { text: "Web Development", color: "cornflowerblue" }
        
    ];
    const carouselInstance = new Carousel(carouselText, "#feature-text");
    carouselInstance.start();

    $(window).scroll(function () {
        if ($(document).scrollTop() > 0 && $(window).width() > 991.98) {
            $('.navbar').addClass('setvisible');
        } else {
            $('.navbar').removeClass('setvisible');
        }
    });

    $.getJSON('assets/json/cv.json', function (data) {
        data.experience.forEach(section => {
            let centreHtml = `
            <div class="centre-section wow fadeInUp">
                <h3 class="section-header wow fadeInUp">${section.header}</h3>
                ${section.items.map(item => {
                    return `
                        <h5 class="job-title pt-1 wow fadeInUp">
                            <strong>${item.title}</strong>
                        </h5>
                        <p class="wow fadeInUp job-date">
                            <em>${item.date}</em>
                        </p>
                        <ul class="section-item pb-lg-2 wow fadeInUp">
                            ${
                                Array.isArray(item.details)
                                ? item.details.map(desc => `<li class="wow fadeInUp">${desc}</li>`).join('')
                                : `<li class="wow fadeInUp">${item.details}</li>`
                            }
                        </ul>
                    `;
                }).join('')}
            </div>
            `;
            $('.centre').append(centreHtml);
            let centremain = new CVMain(section.header, section.items);
            centremain.initSection();
        });
        data.skills.forEach(section => {
            let sidebarHtml = `
            <div class="sidebar-section wow fadeInUp">
              <h3 class="section-header wow fadeInUp pt-2 pt-lg-3">${section.header}</h3>
              

                ${section.items.map(item => {
                    let dates
                    if (item["date"]) {
                        dates =
                        `<p class="wow fadeInUp job-date">
                            <em>${item.date}</em>
                        </p>`
                    }
                    else {
                        dates = `<span></span>`
                    }
                    let details
                    if (item["details"]) {
                        details =
                        `<ul class="section-item pb-lg-2 wow fadeInUp">
                        ${Array.isArray(item.details) 
                            ? item.details.map(desc => 
                                `<li class="wow fadeInUp">${desc}</li>`
                            ).join('') 
                            : `<li class="mb-2 wow fadeInUp">${item.details}</li>`}
                        </ul>`
                    }
                    else {
                        details = `<ul class="section-item mb-3"></ul>`
                    }
                    return `
                        <h5 class="job-title wow fadeInUp">
                        <p class="mb-0 mt-2 wow fadeInUp"><strong>${item.title}</strong></p>
                        </h5>
                        ${dates}
                        ${details}
                    `;
                }).join('')}
            </div>
            `;
            $('.sidebar').append(sidebarHtml);
            let sidebar = new Sidebar(section.header, section.items);
            sidebar.initSection();
        });
    });

    


    $.getJSON('assets/json/cards.json', function (data) {
        const firstThreeCards = data.projects.slice(0, 3);
    
        firstThreeCards.forEach(card => {
            let tagsHtml = card.tags.map(tag => `<span class="card-tag px-2 py-1 mr-2">${tag}</span>`).join(' ');
            let cardHtml = `
            
                <div class="card" id="${card.id}">
                    <a class="card-link" href="post.html?page=${card.id}">
                        <div class="card-top">
                            <img class="card-image" alt="" src="${card.image}"/>
                        </div>
                        <div class="card-mid">
                            <h4 class="card-title font-weight-bold">${card.title}</h4>
                            <label class="card-desc">${card.description}</label>
                        </div>
                    </a>
                    <div class="card-footer">
                        ${tagsHtml}
                    </div>  
                </div>
            `;
            $('#card-container').append(cardHtml);
            let portfolioCard = new Card(card.id, card.title, card.description, card.image);
            portfolioCard.initCard();
        });
    });
    

});