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

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).scrollTop() > 0 && $(window).width() > 991.98) {
            $('.navbar').addClass('setvisible');
        } else {
            $('.navbar').removeClass('setvisible');
        }
    });
    

    $.getJSON('assets/json/cards.json', function (data) {
        let filterHtml = '';

        filterHtml += `<li><a href="#" data-filter="*" class="filter selected">All</a></li>`;

        data.filters.forEach(filter => {
            filterHtml += `<li><a href="#" data-filter=".${filter.replace(' ', '-')}" class="filter">${filter}</a></li>`;
        });

        $('.filter-wrapper').html(filterHtml);

        let projectHtml = '';
        let portfolioCards = [];
        
        data.projects.forEach(project => {
            let tagsHtml = project.tags.map(tag => `<span class="card-tag px-2 py-1 mr-2">${tag}</span>`).join(' ');

            projectHtml += `
                <div class="card ${project.tags.join(' ')}" id="${project.id}">
                    <a class="card-link" href="post.html?page=${project.id}">
                        <div class="card-top">
                            <img class="card-image" alt="${project.title}" src="${project.image}"/>
                        </div>
                        <div class="card-mid">
                            <h4 class="card-title font-weight-bold">${project.title}</h4>
                            <label class="card-desc">${project.description}</label>
                        </div>
                    </a>
                    <div class="card-footer">
                        ${tagsHtml}
                    </div>  
                </div>
            `;

            let portfolioCard = new Card(project.id, project.title, project.description, project.image);
            portfolioCards.push(portfolioCard);
        });

        $('#card-container').html(projectHtml);
        portfolioCards.forEach(card => card.initCard());

        var $container = $('#card-container');
        $('.filter-wrapper li a').click(function() {

            var $this = $(this), filterValue = $this.attr('data-filter');
        
            $container.isotope({ 
                filter: filterValue,
                animationOptions: { 
                    duration: 750, 
                    easing: 'linear', 
                    queue: false
                }
            });             
        
            if ($this.hasClass('selected')) {
                return false;
            }
        
            var filter_wrapper = $this.closest('.filter-wrapper');
            filter_wrapper.find('.selected').removeClass('selected');
            $this.addClass('selected');
        
            return false;
        });

        $('.filter').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var filterValue = $this.data('filter');

            $container.isotope({ filter: filterValue });

            $('.filter').removeClass('selected');
            $this.addClass('selected');
        });
    });
    
});


