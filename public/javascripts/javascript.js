document.addEventListener('DOMContentLoaded', () => {
    const sub_categories_nav = document.querySelector("#sub_categories_nav");
    const sub_categories_nav_container = document.querySelector(".sub_categories_nav_container");
    const sub_nav = document.querySelector("#sub_nav");
    const burger_menu = document.querySelector("#main_nav > div:nth-child(1) > a");
    const chart = document.querySelector("#shopping-cart > a");
    const chart_container = document.querySelector("#chart_container");
    const chart_items = document.querySelector("#chart_items");
    const adds = document.querySelectorAll(".add");
    const chart_button_container = document.querySelector("#chart_button_container");
    const products = document.querySelectorAll(".nb_list_container");
    const shopping_nb = document.querySelector("#shopping-nb");
    const add_product_button = document.querySelector("#add_product_button");


    var current_chart = [];
    var valid_button = null;
    var totalPrice = 0;

    function createPrice(price){
        price = parseFloat(price).toFixed(2);
        const string = price.toString().split('.');
        const unit = string[0];
        const decimal = (string[1]+'0').slice(0,2);
        return "<p class='unit is-inline'>"+unit+"</p><p class='separator is-inline'>,</p><p class=\"decimal is-inline\">"+decimal +"</p><p class='currency is-inline'>€</p>"
    }

    function deleteChartItem(id,categorie){
        const body = {
            id: id,
            categorie: categorie
        };
        var myInit = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'content-type': 'application/json' }
        };
        fetch("http://localhost:3000/chart/delete", myInit);
        current_chart = current_chart.filter((chart)=>{
            return !(chart.product.id == id && chart.product.categorie === categorie);
        });

        if(products){
            products.forEach((elem) => {
                if(elem.dataset.id == id && elem.dataset.categorie === categorie){
                    elem.innerHTML = "";
                }
            });
        }
        refreshChart();
    }

    function addChart(categorie,id,prix,titre,image,nb){
        prix *= nb
        totalPrice += parseFloat(prix);
        let chart_item = document.createElement("div");
        chart_item.classList.add("chart_item");
        chart_item.innerHTML = "<div class=\"chart_cross chart_actif\"><i class=\"fas fa-times\"></i></div>" +
            "                 <div class=\"columns\">\n" +
            "                <div class=\"flex_center column is-one-fifth\">\n" +
            "                    <img src=\"" + image + "\" alt=\"product\">\n" +
            "                </div>\n" +
            "                <div class=\"column is-two-fifth flex_center has-text-centered\">\n" +
            titre +
            "                </div>\n" +
            "                <div class=\"column is-one-fifth flex_center has-text-centered\">\n" +
            createPrice(prix) +
            "                </div>\n" +
            "                <div class=\"column is-one-fifth flex_center has-text-centered\">\n" +
            "                    <span><span class=\"minus_chart\" data-categorie=\""+categorie+"\" data-id=\""+id+"\" ><i class=\"fas fa-solid fa-minus is-inline\"></i></span>\n" +
            "<span class=\"chart_nb_item nb_" + categorie + "_" + id + "\">" + nb + "</span>" +
            "                    </span> <span class=\"add_chart\" data-categorie=\""+categorie+"\" data-id=\""+id+"\"><i class=\" fas fa-solid fa-plus is-inline\"></i></span></span>\n" +
            "                </div>\n" +
            "            </div>\n";
        chart_items.appendChild(chart_item);

        if(products){
            products.forEach((elem) => {
                if(elem.dataset.id == id && elem.dataset.categorie === categorie){
                    elem.innerHTML = "<span class=\"chart_actif\"><span class=\"minus_chart\" data-categorie=\""+categorie+"\" data-id=\""+id+"\"><i class=\"fas fa-solid fa-minus is-inline\"></i></span>\n" +
                        "<span class=\"chart_nb_item nb_" + categorie + "_" + id + "\">" + nb + "</span>" +
                        "<span class=\"add_chart\" data-categorie=\""+categorie+"\" data-id=\""+id+"\"><i class=\" fas fa-solid fa-plus is-inline\"></i></span></span>\n";
                }
            });
        }

        const chart_cross = chart_item.querySelector(".chart_cross");
        chart_cross.addEventListener("click",(event)=>{
            deleteChartItem(id,categorie);
        })
    }

    adds.forEach((add) => {
        add.addEventListener('click', (event) => {
            console.log("add");
            const nb_container = add.parentNode.querySelector(".chart_nb_item");
            if(nb_container){
                const categorie = add.dataset.categorie;
                const id = add.dataset.id;
                const product = current_chart.find((elem) => {
                    return elem.product.id == id && elem.product.categorie === categorie;
                });
                product.nb++;
                setTimeout(() => refreshChart(), 100);
            }else{
                const body = {
                    id: add.dataset.id,
                    categorie: add.dataset.categorie
                };
                var myInit = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'content-type': 'application/json' }
                };
                fetch("http://localhost:3000/chart", myInit)
                    .then(response => response.json())
                    .then((product) => {
                        current_chart.push(product);
                        refreshChart();
                    })
            }
        });
    })



    function refreshChart(){
            chart_items.innerHTML = "";
            totalPrice = 0;
            if(current_chart.length > 0){
                shopping_nb.classList.add("bullInfo");
                shopping_nb.innerHTML = current_chart.length;
                current_chart.forEach((product)=>{
                    addChart(product.product.categorie, product.product.id, product.product.prix, product.product.titre, product.product.photo, product.nb);
                });
                if(!valid_button){
                    valid_button = document.createElement("a");
                }
                chart_button_container.innerHTML = "";
                chart_button_container.appendChild(valid_button);
                valid_button.innerHTML = "<div id=\"bouton_valid\"> Valider la Command "+ createPrice(parseFloat(totalPrice).toFixed(2))+"</div>";
                
            }else{
                if(shopping_nb.classList.contains("bullInfo")) shopping_nb.classList.toggle("bullInfo");
                if(valid_button){
                    chart_button_container.innerHTML = "";
                }
            }

        const minusCharts = document.querySelectorAll(".minus_chart");
        const addCharts = document.querySelectorAll(".add_chart");

        addCharts.forEach((chartElem)=>{
            chartElem.addEventListener('click', (event) => {
                const body = {
                    id: chartElem.dataset.id,
                    categorie: chartElem.dataset.categorie
                };
                var myInit = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'content-type': 'application/json' }
                };

                fetch("http://localhost:3000/chart/plus", myInit);

                const categorie = chartElem.dataset.categorie;
                const id = chartElem.dataset.id;
                const product = current_chart.find((elem)=>{
                    return elem.product.id == id && elem.product.categorie === categorie;
                });
                product.nb++;
                setTimeout(()=> refreshChart(),100);
            });
        })

        minusCharts.forEach((chartElem)=>{
            chartElem.addEventListener('click', (event) => {
                const body = {
                    id: chartElem.dataset.id,
                    categorie: chartElem.dataset.categorie
                };
                var myInit = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'content-type': 'application/json' }
                };

                fetch("http://localhost:3000/chart/minus", myInit);

                const categorie = chartElem.dataset.categorie;
                const id = chartElem.dataset.id;
                const product = current_chart.find((elem)=>{
                    return elem.product.id == id && elem.product.categorie === categorie;
                });
                if(product.nb > 1) {
                    product.nb--;
                    setTimeout(()=> refreshChart(),100);
                }else{
                    deleteChartItem(id,categorie);
                    if(chartElem.parentNode.parentNode) chartElem.parentNode.parentNode.innerHTML = "";
                }
            });
        });
    }

fetch("http://localhost:3000/chart")
    .then(response => response.json())
    .then((chart) => {
        current_chart = chart;
        refreshChart();
    });

    let current_clicked = null;

    const toggleCategoriesMenu = function (){
        if (sub_nav.classList.contains('open') || (sub_categories_nav && sub_categories_nav.classList.contains('open'))){
            if (burger_menu) if (burger_menu.classList.contains('open')) burger_menu.classList.toggle('open');
            if (sub_nav.classList.contains('open')) sub_nav.classList.toggle('open');
            if (sub_categories_nav_container){
                toggleElem(current_clicked);
            }
        }
    }

    const toggleChartMenu = function (){
        if (chart.classList.contains('open')){
            chart.classList.toggle('open');
            chart_container.classList.toggle('open');
        }
    }

    const openChartMenu = function (){
        chart.classList.add('open');
        chart_container.classList.add('open');
    }

    chart.addEventListener('click', (event) => {
        if (chart.classList.contains('open')){
            toggleChartMenu();
        } else{
            openChartMenu();
        }
    })

    document.addEventListener('click', (event) => {
        let target = event.target;
        let toggle_subnav = false;
        let toggle_chart_container = false;
        do{
            if (target === sub_nav || target === burger_menu) toggle_subnav = true;
            if (target === chart_container || target === chart || (target.classList && target.classList.contains("add")) || (target.classList && target.classList.contains("chart_actif"))) toggle_chart_container = true;
            target = target.parentNode;
        } while (target)
        if (!toggle_subnav) toggleCategoriesMenu();
        if (!toggle_chart_container) toggleChartMenu();
    });

    if (burger_menu){
        burger_menu.addEventListener('click', (ve) => {
            if (!burger_menu.classList.contains('open')){
                burger_menu.classList.add('open');
                sub_nav.classList.add('open');
            } else{
                toggleCategoriesMenu();
            }
        });
    }

    function toggleElem(elem){
        if (elem){
            elem.classList.toggle('active');
            elem.classList.add('nav_item');
            current_clicked = null;
        }
        if (sub_categories_nav_container){
            sub_categories_nav.classList.add('is-hidden');
            sub_categories_nav.classList.toggle('open');
        }
    }

    function addSubCat(elem){
        elem.classList.add('active');
        elem.classList.toggle('nav_item');
        current_clicked = elem;
        if (sub_categories_nav_container){
            sub_categories_nav.classList.toggle('is-hidden');

            const categories_nav = elem.querySelector(".categories_nav");

            categories_nav.classList.toggle('is-hidden');
            sub_categories_nav_container.innerHTML = categories_nav.outerHTML;
            categories_nav.classList.add('is-hidden');

            setTimeout(() => {
                sub_categories_nav.classList.add('open');
            }, 10);
        }
    }

    add_product_button.addEventListener('click',(event) => {
        console.log('test');
    })

    const nav_items_clickable = document.querySelectorAll(".nav_item_clickable");
    nav_items_clickable.forEach((elem) => {
        elem.addEventListener('click', (event) => {
            if (elem !== current_clicked){
                if (!!current_clicked){
                    toggleElem(current_clicked);
                }
                current_clicked = elem;
                addSubCat(elem);
            } else{
                current_clicked = null;
                toggleElem(elem)
            }
        })
    })


});