document.addEventListener('DOMContentLoaded', () => {
    const return_form = document.querySelector("#return_form");

    if(return_form){
        if(return_form.dataset.timepass && return_form.dataset.timepass < 30){
            setTimeout(()=>{
                return_form.classList.remove('is-hidden');
            },(parseInt(return_form.dataset.timepass) - 30)*1000)
        }
        return_form.addEventListener("click",()=>{
            if(confirm("Voulez-vous vraiment quitter le site et revenir à l'enquête ?")){
                const body = {
                    gateAway: return_form.dataset.gateaway
                };
                var myInit = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'content-type': 'application/json' }
                };
                fetch("https://core-art-sorbonne.fr/click/clickEnd", myInit)
                    .then(()=>{location.href = "https://essec.qualtrics.com/jfe/form/SV_cBGtxZzmisdwGMe";});
            }
        })
    }
});