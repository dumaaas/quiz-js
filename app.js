const questions = [{
        question: "1. Ko je osnivac kompanije Apple?",
        answers: {
            a: "Bil Gejts",
            b: "Ilon Maks",
            c: "Stiv Dzobs"
        },
        correctAnswer: "c",
        hint: "Prvi posao koji je radio je dizajniranje video igrica."
    },

    {
        question: "2. Kako se zvala prva programerka? Jedan programski jezik nosi njeno ime.",
        answers: {
            a: "Ada Bajron",
            b: "Karmen Elektra",
            c: "Java Script"
        },
        correctAnswer: "a",
        hint: "Objavila je algrotiam koji je trebalo da izvrsi prvi savremeni racunar."
    },

    {
        question: "3. Kako se zove cuveni naucnik o kome govori film The immitation Game?",
        answers: {
            a: "Nikola Tesla",
            b: "Alen Tjuring",
            c: "Tomas Edison"
        },
        correctAnswer: "b",
        hint: "Glavnu ulogu u filmu tumaci Benedict Cumberbatch."
    },

    {
        question: "4. Taylor Otwell je kreirao je kreirao _____________ framework.",
        answers: {
            a: "Laravel",
            b: "Spring Boot",
            c: "VueJS"
        },
        correctAnswer: "a",
        hint: "Orginalno ime ovog frameworka je bilo Bootplant."
    },

    {
        question: "5. Kako se zove serija koja govori o programerskoj revoluciji?",
        answers: {
            a: "Halt and Catch Fire",
            b: "The IT Crowd",
            c: "Mr. Robot"
        },
        correctAnswer: "c",
        hint: "Crna dukserica sa kapuljacom."
    },

    {
        question: "6. Kako se zove najpopularnija baza podataka?",
        answers: {
            a: "PostgreSQL",
            b: "MySQL",
            c: "MongoDB"
        },
        correctAnswer: "b",
        hint: "Ime ove baze je nastalo na osnovu imena cerke jednog od co-foundera."
    }
];

//deklarisanje promjenjive timer, kako bi mogli da joj dodjelimo setTimeout 
//ovaj korak ne bi bio potreban da ne koristimo clearTimeout kako bi resetovali timer
var timer;

//deklarisanje promjenjive clicked, kako bi znali kada je korisnik pritisnuo dugme 'Prikazi rezulate'
//timer prestaje sa obrojavanjem kada se vrijednost clicked promjeni na true
var clicked = false;

const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result');
const endQuizBtn = document.getElementById('end-quiz');
const resetDiv = document.getElementById('reset');
const timerDiv = document.getElementById('stickyTimer');
const timerTextDiv = document.getElementById('timerText');

//funkcija koja pokrece kviz
function startQuiz() {

    //pokretanje timera, kao parametar je moguce postaviti bilo koji broj sekundi 
    countdown(15);

    const output = [];

    questions.forEach(function(currentQuestion, questionInd) {
        const answers = [];
        for (letter in currentQuestion.answers) {
            answers.push(
                `
				<label>
                	<input type="radio" id="select" name="answer${questionInd}" value="${letter}"> 
                	${letter} : ${currentQuestion.answers[letter]}
				</label>
				`
            );
        }

        output.push(
            `
            <div class="questionBlock">
                <div class="question">
                    ${currentQuestion.question} 
                </div>
                <div class="answers">
                    ${answers.join('')} 
                </div>
                <div class="hint">
                    Hint?
                    <div class="showHint">
                    ${currentQuestion.hint}
                    </div>
                </div>
            </div>
            <hr>
            `
        );
    });

    quizDiv.innerHTML = output.join('');
}

//funckija za prikaz rezultata kviza
function showResult(seconds) {
    
    let correctSum = 0;

    // kada se pokrene funkcija za prikazivanje rezultata, mijenjamo clicked na true
    // kako bi timer prestao sa odbrojavanjem
    clicked = true;
    
    //kada prikazemo rezultate, dugme 'Zavrsi kviz' postaje disabled da 
    //bi korisnik mogao da unese odgovore samo jednom, bez mjenjanja
    endQuizBtn.disabled = true;

    //uklanjamo timer sa stranice
    timerDiv.innerHTML = "";
    timerDiv.style.display = "none";

    //selektujemo sve question klase kako bi ih izmjenili u zavisnosti od T/N odgovora
    const question = document.querySelectorAll(".question");

    questions.forEach(function(currentQuestion, questionInd) {
        const selector = ` input[name=answer${questionInd}]:checked `;
        const answered = (document.querySelector(selector) || {}).value;

        if (answered === currentQuestion.correctAnswer) {
            //ako je odgovor tacan -> povecaj broj T odgovora i promjeni boju  pitanja na zelenu
            correctSum++;
            question[questionInd].style.color = "green";
        } else {
            //ako je odgovor netacan -> promjeni boju pitanja na crvenu
            question[questionInd].style.color = "red";
        }
    });

    //vrijeme koje je korisniku bilo potrebno za rijesavanje kviza
    const time = 60 - seconds;

    //tacni odgovori izrazeni procentualno
    let percentage = Number(correctSum / question.length).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
    
    //prikaz rezultata sa brojem tacnih odgovora i vremenom potrebnim za resavanje kviza
    resultDiv.innerHTML = ` 
                            Rezultat: 
                            <h3> ${correctSum} od ${questions.length} (${percentage}) </h3> 
                            Rijeseno za: 
                            <h3> ${time} s </h3> 
                        `;
    resultDiv.style.backgroundColor = "black"; 
}

//funckija za pokretanje timera
function countdown(seconds) {

    //prikazemo korisniku preostalo vrijeme
    timerDiv.innerHTML = "<div class='timerText'> 0:" + (seconds < 10 ? "0" : "") + String(seconds) +"</div>";

    if (seconds > 10 && clicked == false) {
        
        //smanjimo sekunde za jedan
        seconds--;

        //ako je korisniku ostalo vise od 10 sekundi i jos uvijek nije kliknuo 'Zavrsi kviz'
        //postavimo ponovno izvrsavanje funkcije countdown nakon jedne sekunde preko pomocne funkcije setTimeout()
        timer = setTimeout(function() {
            countdown(seconds)
        }, 1000);

        timerDiv.style.color = "#04ca9f";

    } else if (seconds > 0 && clicked == false) {

        //smanjimo sekunde za jedan
        seconds--;

        //ako je korisniku ostalo manje od 10 sekundi i jos uvijek nije kliknuo 'Zavrsi kviz'
        //postavljamo ponovno izvrsavanje funkcije countdown nakon jedne sekunde
        timer = setTimeout(function() {
            countdown(seconds)
        }, 1000);

        //postavimo boju timera na crvenu kako bi se korisniku vizuelno stavilo do znanja da je pri kraju sa vremenom
        timerDiv.style.color = "red";

    } else {

        //ukoliko je vrijeme isteklo ili je korisnik kliknuo na 'Zavrsi kviz'
        //pokrecemo funckiju za prikaz rezultata i prosledjujemo joj trenutni broj sekundi
        //kako bi izracunali koliko je korisniku vremena bilo potrebno za resavanje kviza
        showResult(seconds);

    }
}

//funckija za resetovanje kviza
function resetQuiz() {

    //selektujemo sve question klase
    const question = document.querySelectorAll(".question");

    //postavimo clicked na false, kako bi timer mogao ponovo da se pokrene
    clicked = false;

    //uklonimo disabled vrijednost 'Zavrsi kviz' kako bi korisnik mogao da posalje rezultate ponovo nakon resetovanja kviza
    endQuizBtn.disabled = false;

    //ocistimo trenutni timer i ponovo pokrenemo i prikazemo timer sa 60 sekundi
    clearTimeout(timer);
    countdown(15);
    timerDiv.style.display = "block";

    //prodjemo kroz sva pitanja i unchekiramo sva chekirana polja i vratimo boju pitanja na staro ukoliko je bila promjenjana
    questions.forEach(function(currentQuestion, questionInd) {
        const selector = ` input[name=answer${questionInd}]:checked `;
        const answered = (document.querySelector(selector) || {});
        answered.checked = false;
        question[questionInd].style.color = "black";
    });

    //izbrisemo stare rezultate korisnika ukoliko ih je imao
    resultDiv.innerHTML = "";
    resultDiv.style.backgroundColor = "";

}

endQuizBtn.addEventListener('click', showResult);
resetDiv.addEventListener('click', resetQuiz);
startQuiz();