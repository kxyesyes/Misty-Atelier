export type RecipeNote = {
  slug: string;
  title: string;
  content: string;
  palette: string[];
  composition: string[];
  atmosphere: string[];
  direction: string;
};

export const recipeNotes: RecipeNote[] = [
  {
    slug: "blue-white-atelier-girl",
    title: "Palette Study",
    content:
      "Blue-white values, paper texture, and studio spacing define the visual language for the whole archive.",
    palette: ["blue-white contrast", "paper cream", "muted rain grey"],
    composition: ["calm centered posture", "studio tools kept peripheral", "large quiet margins"],
    atmosphere: ["studio stillness", "soft daylight", "handled paper"],
    direction:
      "Keep the image quiet and tactile: emphasize paper texture, restrained blue-white values, and a studio arrangement that feels observed rather than staged.",
  },
  {
    slug: "rainy-headphones-desk",
    title: "Rain Room Rhythm",
    content:
      "Rain, headphones, and desk objects are layered as small sound cues rather than decorative props.",
    palette: ["rain grey", "desk cream", "muted blue shadow"],
    composition: ["desk edge as anchor", "figure enclosed by objects", "window rhythm in the background"],
    atmosphere: ["indoor listening", "rain-soft focus", "private concentration"],
    direction:
      "Treat the desk as a listening chamber: keep the weather present through glass and soft grey light while letting headphones and small objects imply sound.",
  },
  {
    slug: "moss-deer-at-glasshouse-end",
    title: "Healing Fable",
    content:
      "A botanical space becomes gently unreal through moss color, soft glass, and a single folklore gesture.",
    palette: ["moss green", "glass white", "soft botanical shadow"],
    composition: ["creature placed at the threshold", "greenhouse depth line", "plants framing the apparition"],
    atmosphere: ["botanical hush", "gentle folklore", "healing unrealness"],
    direction:
      "Let the fable stay small: use moss color, glass reflections, and a single quiet creature so the scene feels enchanted without becoming loud fantasy.",
  },
  {
    slug: "tide-postman-and-cloud-whale",
    title: "Distant Delivery",
    content:
      "The fable works best when the scale feels impossible but the errand still feels ordinary.",
    palette: ["pale sea air", "cloud white", "soft warm grey"],
    composition: ["tiny messenger against vast scale", "whale crossing the upper field", "open negative space"],
    atmosphere: ["impossible distance", "ordinary errand", "sea-borne calm"],
    direction:
      "Preserve the imbalance between scale and task: make the whale enormous and the delivery ordinary, with pale air and open space carrying the wonder.",
  },
  {
    slug: "quiet-letter-by-the-window",
    title: "Window Narrative",
    content:
      "The letter, the window, and the empty space around the figure create a quiet story without explaining it.",
    palette: ["paper cream", "window blue grey", "soft domestic shadow"],
    composition: ["letter as focal object", "figure near window light", "empty space left unresolved"],
    atmosphere: ["unread words", "domestic pause", "soft narrative tension"],
    direction:
      "Keep the story unresolved: use window light, the held letter, and surrounding quiet space to suggest a private narrative without explaining the event.",
  },
];
