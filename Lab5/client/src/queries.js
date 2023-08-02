import { gql } from "@apollo/client";

const Locationlist = gql`
  query Query($pageNum: Int) {
    locationPosts(pageNum: $pageNum) {
      id
      liked
      name
      image
      address
      userPosted
    }
  }
`;

const userLocations = gql`
  query Query {
    userPostedLocations {
      id
      name
      address
      image
      liked
      userPosted
    }
  }
`;

const likedLocations = gql`
  query Query {
    likedLocations {
      id
      name
      image
      address
      userPosted
      liked
    }
  }
`;

const uploadLocation = gql`
  mutation Mutation($image: String!, $address: String, $name: String) {
    uploadLocation(image: $image, address: $address, name: $name) {
      id
      name
      image
      address
      liked
      userPosted
    }
  }
`;

const updateLocation = gql`
  mutation Mutation(
    $id: ID!
    $image: String
    $name: String
    $address: String
    $userPosted: Boolean
    $liked: Boolean
  ) {
    updateLocation(
      id: $id
      image: $image
      name: $name
      address: $address
      userPosted: $userPosted
      liked: $liked
    ) {
      id
      name
      image
      address
      userPosted
      liked
    }
  }
`;

const deleteLocation = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      id
      address
      image
      liked
      name
      userPosted
    }
  }
`;

let exported = {
  Locationlist,
  likedLocations,
  uploadLocation,
  updateLocation,
  deleteLocation,
  userLocations,
};

export default exported;
