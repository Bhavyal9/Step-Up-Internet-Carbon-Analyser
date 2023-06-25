const target1 = document.querySelector(".target1")
const target2 = document.querySelector(".target2")
const business = document.querySelector(".business")
const user = document.querySelector(".user")
let calculate = document.querySelector(".submitButton")
let report = document.querySelector(".report")
let reportContainer = document.querySelector(".report-container")
let close = document.querySelector(".close")
let form =document.querySelector(".myForm")

form.addEventListener("submit",(e)=>{
    e.preventDefault();
})

target1.addEventListener("click",()=>{
user.classList.add("hide")
business.classList.remove("hide")
target1.classList.add("green")
target1.classList.remove("heading-color")
target2.classList.add("heading-color")
target2.classList.remove("green")
});

target2.addEventListener("click",()=>{
    business.classList.add("hide")
    user.classList.remove("hide")
    target2.classList.add("green")
    target2.classList.remove("heading-color")
    target1.classList.add("heading-color")
    target1.classList.remove("green")
    });

calculate.addEventListener("click",()=>{
report.classList.remove("hide")
reportContainer.classList.remove("hide")
});

close.addEventListener("click",()=>{
        report.classList.add("hide")
        reportContainer.classList.add("hide")
        })

