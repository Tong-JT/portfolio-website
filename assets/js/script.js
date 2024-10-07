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
        var $cardDom = $('#' + this.idCard);
        $cardDom.on('mouseover', () => {
            var $cardTitle = $cardDom.find('.card-title');
            var $cardDesc = $cardDom.find('.card-desc');
            var $cardMiddle = $cardDom.find('.card-mid');
            var $cardFooter = $cardDom.find('.card-footer');
            var cardMiddleHeight = $cardTitle.outerHeight(true) + $cardDesc.outerHeight(true)+ $cardFooter.outerHeight(true);
            $cardMiddle.css('height', cardMiddleHeight + 15 + 'px');
            console.log(cardMiddleHeight);
        });
        $cardDom.on('mouseout', () => {
            var $cardMiddle = $cardDom.find('.card-mid');
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
        const sentence = $(this.eleRef).html();
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
        { text: "Data Science", color: "salmon" },
        { text: "Web Development", color: "cornflowerblue" },
        { text: "Machine Learning", color: "darkcyan" },
        
    ];
    const carouselInstance = new Carousel(carouselText, "#feature-text");
    carouselInstance.start();

    $(window).scroll(function () {
        if ($(document).scrollTop() > 0) {
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
                <ul class="section-items wow fadeInUp">
                    ${section.items.map(item => `
                        <h5 class = "job-title pt-1 wow fadeInUp"><strong>${item.title}</strong></h5>
                        <p class = "wow fadeInUp"><strong>${item.date}</strong></p>
                        <ul class="section-item pb-4 wow fadeInUp">
                            <ul>
                                ${Array.isArray(item.details)
                    ? item.details.map(desc => `<li class = "wow fadeInUp">${desc}</li>`).join('')
                    : `<li class= "wow fadeInUp">${item.details}</li>`}
                            </ul>
                        </ul>
                    `).join('')}
                </ul>
            </div>
            `;
            $('.centre').append(centreHtml);
            let centremain = new CVMain(section.header, section.items);
            centremain.initSection();
        });
        data.skills.forEach(section => {
            let sidebarHtml = `
            <div class="sidebar-section wow fadeInUp">
                <h3 class="section-header wow fadeInUp">${section.header}</h3>
                <ul class="section-items wow fadeInUp">
                    ${section.items.map(item => `
                        <li class="section-item wow fadeInUp">
                            <p class = "mb-0 mt-2 wow fadeInUp"><strong>${item.title}</strong>: </p>
                            <ul>
                                ${Array.isArray(item.description)
                    ? item.description.map(desc => `<li class = "wow fadeInUp">${desc}</li>`).join('')
                    : `<li class = "mb-2 wow fadeInUp">${item.description}</li>`}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
            </div>
            `;
            $('.sidebar').append(sidebarHtml);
            let sidebar = new Sidebar(section.header, section.items);
            sidebar.initSection();
        });
    });

    $.getJSON('assets/json/cards.json', function (data) {
        data.forEach(card => {
            let tagsHtml = card.tags.map(tag => `<span class="card-tag px-2 py-1 mr-2">${tag}</span>`).join(' ');
            let cardHtml = `
                <div class="card" id="${card.id}">
                    <div class="card-top"><img class="card-image" alt="" src="${card.image}"/></div>
                    <div class="card-mid">
                        <h4 class="card-title font-weight-bold">${card.title}</h4>
                        <label class="card-desc">${card.description}</label>
                    </div>
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

