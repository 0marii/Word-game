const letters=document.querySelectorAll(".scoreboard-letter");
const loadingDiv=document.querySelector(".info-bar");
const ANSWER_LENGTH=5;//(screaming case) all capital because its const




async function init() {
  let currentGuess="";
  let currentRow=0;    
  let done =false;//to make the player stop playing if he win or lose and make the event lestner stops
  let isLoading = true;



  const res=await fetch("https:words.dev-apis.com/word-of-the-day");//to get the response from the api
  const resObj=await res.json();
  const word = resObj.word.toUpperCase();
  const ROUNDS=6;//to keep track of how many rounds the player playes
  const wordParts=word.split("");//here is the letter of the correct answer
  isLoading = false;
  setLoading(isLoading);





  function addLetter(letter)
{
  
  if(currentGuess.length<ANSWER_LENGTH)
  {
    //add letter to the end
    currentGuess+=letter;
  }
  else
  {//here we change the last letter in the guess by replace the old letter with the new one
    //replace the last letter
    currentGuess=currentGuess.substring(0,currentGuess.length-1)+letter;
  }
   letters[ANSWER_LENGTH*currentRow+currentGuess.length - 1].innerText = letter;
}

async function commit() {
  if(currentGuess.length!=ANSWER_LENGTH)
  {
    //do nothing
    return;
  }





  //marking as correct or wrong 
  //in this way(currentGuess.split("");) we can split the string each char alone and save all of them in array
  const guessParts=currentGuess.split("");//we will store the user guess here 
  const map=makeMap(wordParts);
  console.log(map);
  
  //mark as correct 
  for(let i=0;i<ANSWER_LENGTH;i++)
  {
    
    if(guessParts[i]===wordParts[i])
    {
      letters[currentRow*ANSWER_LENGTH+i].classList.add("correct");
      map[guessParts[i]--];//to trace if there more instance of a letter to mark
    }
  }

  //mark as close amd wrong 
  for(let i=0;i<ANSWER_LENGTH;i++)
    {
      if(guessParts[i]===wordParts[i])
    {/*do nothing , we already did it*/ }
      else if(wordParts.includes(guessParts[i])&&map[guessParts[i]]>0)//mark as close , in this way the first letter will mark as close and the second one as wrong
      {
        letters[currentRow*ANSWER_LENGTH+i].classList.add("close");
        map[guessParts[i]--];//to trace if there more instance of a letter to mark
      }
      //mark as wrong
      else {
        letters[currentRow*ANSWER_LENGTH+i].classList.add("wrong");
      }
    }
    




  currentRow++;
  currentGuess='';
  


      //win 
      if(currentGuess===word)
        {
          //win
          alert('you win');
          done=true;
          return;
        }
        //lose
        if(currentRow===ROUNDS)
        {
          alert('you lose the word was '+word);
          done =true;
        }
     

}

function backspace()
{
  currentGuess=currentGuess.substring(0,currentGuess.length-1);
  letters[ANSWER_LENGTH*currentRow+currentGuess.length].innerText="";
}


  document.addEventListener('keydown',function handleKeyPress(event){

    if(done||isLoading)
    {
      //do nothing
      return;
    }

    const action=event.key;
    
    if(action==='Enter')
    {
      commit();
    }
    else if(action==='Backspace')
    {
      backspace();
    }
    else if(isLetter(action))
    {
      addLetter(action.toUpperCase());
    }
    else
    {
      //do nothing
    }
  });
}

function setLoading(isLoading)
{//toggle works as if the loading div is hidden make it appear and if
  //its not make it disappear 
  loadingDiv.classList.toggle('show',isLoading);
}



function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array)//this function for counting the letter , ex word:pool p=1, o=2, l=1;
{
  const obj={};
  for (let index = 0; index < array.length; index++) {
   const letter=array[index];
   if(obj[letter]){
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