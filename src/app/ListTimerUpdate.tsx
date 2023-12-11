import { OwnReactComponent } from "../ownReact/OwnReactComponent";
import { List } from "./List";
import { ListItem } from "./ListItem";

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

let timer;

const updateAlphabetState = state => {
  const newAlphabet = [...state.alphabet];
  const randomLength = Math.floor(Math.random() * newAlphabet.length);

  for (let i = 0; i < randomLength; i += 1) {
    const randomIndex1 = Math.floor(Math.random() * newAlphabet.length);
    const randomIndex2 = Math.floor(Math.random() * newAlphabet.length);

    const temp = newAlphabet[randomIndex1];
    newAlphabet[randomIndex1] = newAlphabet[randomIndex2];
    newAlphabet[randomIndex2] = temp;
  }

  return {
    alphabet: newAlphabet
  };
};

/**
 * List with random numbers
 */
export class ListTimerUpdate extends OwnReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      alphabet
    };
  }

  // randomly changes position of random number of letters in alphabet
  updateAlphabet() {
    this.setState(updateAlphabetState);
  }

  componentDidMount() {
    timer = setInterval(() => {
      this.updateAlphabet();
    }, 5000);

    this.setState({
      alphabet
    });
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  render() {
    // creating list items
    const listItems = this.state.alphabet.map(letter => {
      return <ListItem key={letter}>{letter}</ListItem>;
    });

    return <List>{listItems}</List>;
  }
}
