const letters=document.querySelectorAll('.scoreboard-letter');
const loadingDiv=document.querySelector('.info-bar');
const ANSWER_LENGTH=5;

let currentGuess='';
let currentRow=0;
let wordArray='';
let correctword='';
let map='';




async function init()
{
    setLoading(false);

    const res=await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj=await res.json();
    const word= resObj.word.toUpperCase();
    correctword=word;
    wordArray=word.split('');

    map=makeMap(wordArray);
    console.log(map);
    
    


    setLoading(true);

    console.log(word);


    document.addEventListener('keydown',function handlekeyPress(event){

        const action=event.key;

        console.log(action);

        if(action === 'Enter')
        {
            commit();
        }
        else if(action === 'Backspace')
        {
            backspace();
        }
        else if(isLetter(action))
        {
            addLetter(action.toUpperCase());
        }

    });
}

function setLoading(isloading)
{
    console.log(isloading);
    loadingDiv.classList.toggle('hidden',isloading);

}

function backspace()
{
    currentGuess=currentGuess.substring(0,currentGuess.length-1);
    letters[ANSWER_LENGTH*currentRow+currentGuess.length].innerText = '';

}

async function commit()
{
    if(currentGuess.length != ANSWER_LENGTH)
    {
        return;
    }

    if(currentGuess===correctword)
    {
        alert('you win!');
        document.querySelector('.brand').classList.add('winner');
    }

    if(currentRow==ANSWER_LENGTH)
    {
        alert('you lose!');
    }

    map=makeMap(wordArray);
    console.log(map);

    setLoading(false);
    const res=await fetch("https://words.dev-apis.com/validate-word",{
        method:'POST',
        body: JSON.stringify({word: currentGuess}),
    });

    const{ validWord }= await res.json();

    setLoading(true);

    if(!validWord)
    {
        markInvalidWord();
        return;
    }



    




    const guessArray=currentGuess.split('');

    for(let j=0;j<guessArray.length;j++)
    {
        if(guessArray[j]=== wordArray[j])
        {
            letters[currentRow*ANSWER_LENGTH + j ].classList.add("correct");
            map[guessArray[j]]--;
        }
    }

    for(let j=0;j<guessArray.length;j++)
    {
        if(guessArray[j] === wordArray[j])
        {

        }
        else if(wordArray.includes(guessArray[j]) && map[guessArray[j]]>0)
        {
            letters[currentRow*ANSWER_LENGTH +j].classList.add('close');
            map[guessArray[j]]--;
        }
        else
        {
            letters[currentRow*ANSWER_LENGTH+j].classList.add('wrong');
        }
    }






    currentRow++;
    currentGuess='';
}

function markInvalidWord()
{
    for(let j=0;j<ANSWER_LENGTH;j++)
    {
        letters[currentRow*ANSWER_LENGTH+j].classList.remove('invalid');

        setTimeout(function(){
            letters[currentRow*ANSWER_LENGTH+j].classList.add('invalid');
        },10);
    }
}

function addLetter(letter)
{
    if(currentGuess.length<ANSWER_LENGTH)
    {
        currentGuess+=letter;
    }
    else
    {
        currentGuess=currentGuess.substring(0,currentGuess.length-1)+letter;
    }

    letters[currentRow*5+currentGuess.length-1].innerText=letter;
}

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array)
{
    const obj={};

    for(let j=0;j<array.length;j++)
    {
        const letter=array[j];

        if(obj[letter])
        {
            obj[letter]++;
        }
        else
        {
            obj[letter]=1;
        }
    }

    return obj;
}

init();

