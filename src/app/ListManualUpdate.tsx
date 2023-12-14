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

interface Props {}
interface State {
  alphabet: string[] | JSX.Element;
  unchangingLetters: Set<string>;
  lettersToFilter: string;
}
/**
 * List with random letters that updated manually on button click
 * Additionally, there is an input field that define unchangeble characters and their order
 */
export class ListManualUpdate extends OwnReactComponent<Props, State> {
  state = {
    alphabet,
    unchangingLetters: new Set<string>(),
    lettersToFilter: ""
  };

  // randomly changes position of random number of letters in the alphabet
  handleUpdateClick = () => {
    this.setState(updateAlphabetState);
  }

  // changes unchangeble characters and their order
  handleFilterChange = (event) => {
    const newLettersToFilter = event.target.value;
    const newUnchangingLetters = new Set(
      event.target.value.toUpperCase().split("")
    );

    this.setState({
      unchangingLetters: newUnchangingLetters,
      lettersToFilter: newLettersToFilter
    });
  }

  render() {
    // creating list items
    // first takes unchangeble characters and their order, then adds the rest of the alphabet
    const listItems = [...this.state.unchangingLetters].map((letter) => {
      return <ListItem key={letter}>{letter}</ListItem>;
    });

    this.state.alphabet.forEach(letter => {
      if (!this.state.unchangingLetters.has(letter)) {
        listItems.push(<ListItem key={letter}>{letter}</ListItem>);
      }
    });

    return (
      <div>
        <List>{listItems}</List>
        <div>
          <input onInput={this.handleFilterChange} type="text" />
        </div>
        <div>
          <button
            onClick={this.handleUpdateClick}
            value={this.state.lettersToFilter}
          >
            Update
          </button>
        </div>
      </div>
    );
  }
}
