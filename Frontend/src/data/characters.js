import Maya from "../assets/website/Maya.jpeg";
import Madhav from "../assets/website/Madhav.jpeg";
import Mother from "../assets/website/Mother.jpeg";
import RadhaJi from "../assets/website/RadhaJi.jpeg";
import Krishna from "../assets/website/Krishna.jpeg";
import Shiva from "../assets/website/Shiva.jpeg";

/**
 * The cast of the Mohan-Maya story. Used by "Meet the Characters" on the
 * home page and by product detail "Character Story" sections.
 */
export const characters = [
  {
    id: "maya",
    name: "Maya",
    title: "The Village Girl",
    image: Maya,
    tagline: "Courage in every trial",
    story:
      "Maya is a spirited village girl whose everyday life is filled with unexpected trials. Her innocence and resilience are the heart of the story - every challenge she faces becomes a doorway to devotion.",
  },
  {
    id: "mohan",
    name: "Mohan",
    title: "The Divine Protector",
    image: Madhav,
    tagline: "Devotion that protects",
    story:
      "Mohan is the divine protector who answers Maya's call. With boundless devotion and spiritual power, he turns despair into hope and guards Maya through every storm.",
  },
  {
    id: "mother",
    name: "Mother",
    title: "The Guiding Heart",
    image: Mother,
    tagline: "Love that grounds us",
    story:
      "Mother is the steady, nurturing presence whose wisdom and love anchor Maya. She represents the warmth of home and the strength found in family.",
  },
  {
    id: "radha-ji",
    name: "Radha Ji",
    title: "Embodiment of Devotion",
    image: RadhaJi,
    tagline: "The soul of pure love",
    story:
      "Radha Ji embodies the highest form of devotion. Her presence in the tale is a reminder that love, when pure, becomes the very path to the divine.",
  },
  {
    id: "krishna",
    name: "Krishna",
    title: "The Eternal Friend",
    image: Krishna,
    tagline: "Joy, wisdom & play",
    story:
      "Krishna brings playfulness, wisdom and cosmic reassurance. As the eternal friend and guide, he reminds Maya that the divine is never far.",
  },
  {
    id: "shiva",
    name: "Shiva",
    title: "The Cosmic Guardian",
    image: Shiva,
    tagline: "Stillness & power",
    story:
      "Shiva represents stillness, transformation and immense power. His calm presence dissolves fear and restores balance whenever darkness gathers.",
  },
];

export const getCharacter = (id) => characters.find((c) => c.id === id);
