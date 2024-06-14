import { db, collection, addDoc, query, where, getDocs, updateDoc, doc } from './firebase.js';

document.getElementById('uploadButton').addEventListener('click', uploadWords);
document.getElementById('neverPracticed').addEventListener('click', () => selectWords('neverPracticed'));
document.getElementById('incorrectPracticed').addEventListener('click', () => selectWords('incorrectPracticed'));
document.getElementById('allPracticed').addEventListener('click', () => selectWords('allPracticed'));
document.getElementById('startTest').addEventListener('click', startTest);
document.getElementById('playButton').addEventListener('click', playAudio);
document.getElementById('spellingInput').addEventListener('keypress', checkSpelling);
document.getElementById('showButton').addEventListener('click', showCorrectSpelling);
document.getElementById('nextButton').addEventListener('click', nextWord);

let words = [];
let currentWordIndex = 0;
let currentWord = '';

async function uploadWords() {
    const fileUpload = document.getElementById('fileUpload').files[0];
    if (!fileUpload) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const text = e.target.result;
        const wordList = text.split('\n');
        const collectionRef = collection(db, 'words');
        for (let word of wordList) {
            if (word.trim() !== '') {
                await addDoc(collectionRef, { word: word.trim(), practiced: false, incorrectCount: 0, lastTested: null });
            }
        }
        alert('Words uploaded successfully.');
    };
    reader.readAsText(fileUpload);
}

async function selectWords(type) {
    let q;
    if (type === 'neverPracticed') {
        q = query(collection(db, 'words'), where('practiced', '==', false));
    } else if (type === 'incorrectPracticed') {
        q = query(collection(db, 'words'), where('incorrectCount', '>', 0));
    } else {
        q = query(collection(db, 'words'));
    }

    const querySnapshot = await getDocs(q);
    words = [];
    querySnapshot.forEach((doc) => {
        words.push({ id: doc.id, ...doc.data() });
    });

    alert(`Selected ${words.length} words.`);
}

function startTest() {
    if (words.length === 0) {
        alert('No words selected for testing.');
        return;
    }

    currentWordIndex = 0;
    loadWord();
    document.getElementById('testPage').style.display = 'block';
}

function loadWord() {
    currentWord = words[currentWordIndex];
    document.getElementById('wordIndex').innerText = currentWordIndex + 1;
    document.getElementById('audio').src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${currentWord.word}&tl=en`;
    document.getElementById('spellingInput').value = '';
    document.getElementById('result').innerText = '';
}

function playAudio() {
    document.getElementById('audio').play();
}

async function checkSpelling(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim().toLowerCase();
        if (input === currentWord.word.toLowerCase()) {
            document.getElementById('result').innerText = 'Correct!';
            const wordRef = doc(db, 'words', currentWord.id);
            await updateDoc(wordRef, { practiced: true, lastTested: new Date(), incorrectCount: 0 });
            nextWord();
        } else {
            document.getElementById('result').innerText = 'Incorrect!';
            const wordRef = doc(db, 'words', currentWord.id);
            await updateDoc(wordRef, { incorrectCount: currentWord.incorrectCount + 1 });
        }
    }
}

function showCorrectSpelling() {
    document.getElementById('result').innerText = `Correct Spelling: ${currentWord.word}`;
    document.getElementById('nextButton').style.display = 'block';
}

function nextWord() {
    currentWordIndex++;
    if (currentWordIndex < words.length) {
        loadWord();
    } else {
        alert('Test completed!');
        document.getElementById('testPage').style.display = 'none';
    }
}
