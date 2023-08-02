import { gql } from "@apollo/client";

const AllCharacters = gql`
  query MarvelCharactersList($pageNum: Int, $searchTerm: String) {
    marvelCharactersList(pageNum: $pageNum, searchTerm: $searchTerm) {
      id
      name
      comics
      description
      series
      stories
      thumbnail
      events
    }
  }
`;

const CHARACTER = gql`
  query CharacterDetails($id: Int!) {
    characterDetails(id: $id) {
      comics
      description
      events
      id
      name
      series
      stories
      thumbnail
    }
  }
`;

export default {
  AllCharacters,
  CHARACTER,
};
