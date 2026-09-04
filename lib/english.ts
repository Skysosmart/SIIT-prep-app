import type { Question } from "./questions";

/**
 * Original English question bank in the style of the SIIT/OSP entrance exam:
 * grammar, vocabulary, error spotting, and reading comprehension. All items
 * are written from scratch (no copyrighted passages). ids 3001+.
 */
const E = (
  id: number, topic: Question["topic"], answer: number, q: string,
  choices: string[], concept: string, explain: string, passage?: string,
): Question => ({
  id, topic, kind: "recall", timer: 30, tag: "core", answer, q, choices,
  formula: concept, explain, passage,
});

export const ENGLISH_QUESTIONS: Question[] = [
  // ── Grammar (3001–3020) ────────────────────────────────────────
  E(3001,"gra",1,"Choose the correct option: She ____ in Bangkok since 2019.",
    ["lives","has lived","is living","lived"],"Present perfect + since","\"Since\" with a point in time takes the present perfect: has lived."),
  E(3002,"gra",2,"If I ____ more time, I would learn another language.",
    ["have","had had","had","will have"],"Second conditional","Unreal present: if + past simple, would + base verb."),
  E(3003,"gra",0,"The report, ____ was submitted late, still received full marks.",
    ["which","who","whom","what"],"Relative pronouns","Non-defining clause about a thing uses \"which\"."),
  E(3004,"gra",3,"Neither the teacher nor the students ____ ready for the test.",
    ["is","has","was","were"],"Subject–verb agreement","With \"neither…nor\", the verb agrees with the nearer subject (students → were)."),
  E(3005,"gra",1,"By the time we arrived, the show ____.",
    ["already started","had already started","has already started","was already starting"],"Past perfect","An action completed before another past action uses the past perfect."),
  E(3006,"gra",2,"You ____ smoke here; it is strictly prohibited.",
    ["needn't","don't have to","mustn't","couldn't"],"Modals of prohibition","\"Mustn't\" expresses prohibition; \"don't have to\" expresses absence of obligation."),
  E(3007,"gra",0,"I look forward to ____ from you soon.",
    ["hearing","hear","heard","have heard"],"Gerund after preposition","\"Look forward to\" is followed by a gerund (-ing)."),
  E(3008,"gra",3,"This is ____ interesting book I have ever read.",
    ["a most","the more","more","the most"],"Superlative","\"Ever read\" signals a superlative: the most."),
  E(3009,"gra",1,"The manager asked me ____ I had finished the assignment.",
    ["that","whether","what","which"],"Reported yes/no questions","Reported yes/no questions use \"whether\" or \"if\"."),
  E(3010,"gra",2,"Hardly ____ sat down when the phone rang.",
    ["I had","had","had I","I have"],"Inversion after negative adverbial","After \"hardly\" at the start, subject and auxiliary invert: had I."),
  E(3011,"gra",0,"The furniture in the new office ____ very modern.",
    ["is","are","were","have been"],"Uncountable nouns","\"Furniture\" is uncountable and takes a singular verb."),
  E(3012,"gra",1,"He speaks English ____ than his brother.",
    ["more fluent","more fluently","fluentlier","most fluently"],"Comparative adverbs","Adverbs form comparatives with \"more\": more fluently."),
  E(3013,"gra",3,"She had the mechanic ____ her car yesterday.",
    ["to repair","repaired","repairing","repair"],"Causative \"have\"","\"have someone do something\" uses the bare infinitive: repair."),
  E(3014,"gra",2,"Not only ____ late, but he also forgot the documents.",
    ["he was","was","was he","he had"],"Inversion after \"not only\"","\"Not only\" at the start inverts subject and verb: was he."),
  E(3015,"gra",0,"I wish I ____ harder for the previous exam.",
    ["had studied","studied","have studied","would study"],"Wish + past perfect","Regret about the past uses wish + past perfect."),
  E(3016,"gra",1,"The number of applicants ____ increasing every year.",
    ["are","is","have been","were"],"\"The number of\" agreement","\"The number of\" takes a singular verb: is."),
  E(3017,"gra",2,"You should get your eyes ____ regularly.",
    ["check","to check","checked","checking"],"Causative passive","\"get something done\" uses the past participle: checked."),
  E(3018,"gra",3,"____ the heavy rain, the match continued.",
    ["Although","Because of","However","Despite"],"Concession prepositions","\"Despite\" + noun phrase shows contrast; \"although\" needs a clause."),
  E(3019,"gra",0,"If she ____ the earlier train, she would have arrived on time.",
    ["had caught","caught","catches","would catch"],"Third conditional","Unreal past: if + past perfect, would have + past participle."),
  E(3020,"gra",1,"Each of the students ____ a unique ID number.",
    ["have","has","have got","are having"],"\"Each of\" agreement","\"Each of\" is singular and takes \"has\"."),

  // ── Vocabulary (3021–3040) ─────────────────────────────────────
  E(3021,"voc",2,"Choose the word closest in meaning to \"meticulous\".",
    ["careless","generous","careful","hasty"],"Synonyms","\"Meticulous\" means showing great attention to detail = careful."),
  E(3022,"voc",0,"Choose the word opposite in meaning to \"abundant\".",
    ["scarce","plentiful","ample","numerous"],"Antonyms","\"Abundant\" (plentiful) is the opposite of \"scarce\"."),
  E(3023,"voc",1,"The scientist's theory was ____ by the new evidence.",
    ["confirmed","refuted","praised","published"],"Context clues","\"Refuted\" means proven wrong, fitting evidence against a theory."),
  E(3024,"voc",3,"Her ____ remarks offended several people in the audience.",
    ["flattering","tactful","gracious","derogatory"],"Word choice","\"Derogatory\" means insulting, matching \"offended\"."),
  E(3025,"voc",2,"Choose the word closest in meaning to \"inevitable\".",
    ["avoidable","doubtful","unavoidable","optional"],"Synonyms","\"Inevitable\" means certain to happen = unavoidable."),
  E(3026,"voc",0,"The old bridge was in a ____ state and had to be closed.",
    ["dilapidated","pristine","robust","sturdy"],"Context clues","\"Dilapidated\" means in disrepair, fitting a bridge that must close."),
  E(3027,"voc",1,"To \"mitigate\" a problem is to ____ it.",
    ["worsen","lessen","ignore","cause"],"Verb meaning","\"Mitigate\" means to make less severe = lessen."),
  E(3028,"voc",3,"A person who is \"frugal\" is careful with ____.",
    ["words","time","health","money"],"Word meaning","\"Frugal\" describes being economical with money."),
  E(3029,"voc",2,"Choose the correct word: The witness gave a ____ account of the accident.",
    ["credulous","incredible","coherent","incoherent"],"Word choice","A reliable, clear account is \"coherent\"."),
  E(3030,"voc",0,"\"Ambiguous\" instructions are ____.",
    ["unclear","detailed","simple","written"],"Word meaning","\"Ambiguous\" means open to more than one interpretation = unclear."),
  E(3031,"voc",1,"The CEO's ____ leadership guided the company through the crisis.",
    ["timid","astute","reckless","indifferent"],"Positive connotation","\"Astute\" (shrewd, perceptive) fits successful crisis leadership."),
  E(3032,"voc",2,"Choose the word closest in meaning to \"tedious\".",
    ["exciting","brief","boring","difficult"],"Synonyms","\"Tedious\" means tiresomely long or dull = boring."),
  E(3033,"voc",3,"The medicine had an immediate and ____ effect on the patient.",
    ["adverse","harmful","negative","beneficial"],"Positive context","\"Beneficial\" fits a helpful effect of medicine."),
  E(3034,"voc",0,"To \"advocate\" a policy is to ____ it.",
    ["support","oppose","delay","study"],"Verb meaning","\"Advocate\" means to publicly support."),
  E(3035,"voc",1,"A \"unanimous\" decision is one that ____.",
    ["most people accept","everyone agrees on","no one likes","is postponed"],"Word meaning","\"Unanimous\" means agreed by everyone."),
  E(3036,"voc",2,"Choose the word opposite in meaning to \"transparent\".",
    ["clear","obvious","opaque","honest"],"Antonyms","\"Opaque\" (not able to be seen through) is the opposite of transparent."),
  E(3037,"voc",0,"The lecture was so ____ that many students fell asleep.",
    ["monotonous","engaging","concise","lively"],"Context clues","\"Monotonous\" (dull and unvarying) explains students falling asleep."),
  E(3038,"voc",3,"To \"exacerbate\" tensions is to ____ them.",
    ["ease","resolve","ignore","intensify"],"Verb meaning","\"Exacerbate\" means to make worse = intensify."),
  E(3039,"voc",1,"A \"prudent\" investor is ____.",
    ["reckless","cautious","wealthy","lucky"],"Word meaning","\"Prudent\" means acting with care and foresight = cautious."),
  E(3040,"voc",2,"Choose the word closest in meaning to \"novel\" (adjective).",
    ["old","boring","new","famous"],"Synonyms","As an adjective, \"novel\" means new or original."),

  // ── Error Spotting (3041–3055) ─────────────────────────────────
  E(3041,"err",1,"Find the error: (A) Each of / (B) the players have / (C) their own / (D) locker.",
    ["A","B","C","D"],"Subject–verb agreement","\"Each of\" is singular, so it should be \"has\", not \"have\"."),
  E(3042,"err",2,"Find the error: (A) She is / (B) more taller / (C) than / (D) her sister.",
    ["A","B","C","D"],"Double comparative","\"Taller\" is already comparative; \"more taller\" is wrong."),
  E(3043,"err",0,"Find the error: (A) The informations / (B) provided / (C) were / (D) very useful.",
    ["A","B","C","D"],"Uncountable nouns","\"Information\" is uncountable and has no plural \"informations\"."),
  E(3044,"err",3,"Find the error: (A) He suggested / (B) that we / (C) should to / (D) leave early.",
    ["A","B","C","D"],"Infinitive form","After \"should\" use the base verb: \"leave\", not \"to leave\"."),
  E(3045,"err",1,"Find the error: (A) Despite of / (B) the rain, / (C) we went / (D) hiking.",
    ["A","B","C","D"],"Preposition usage","It is \"despite\" or \"in spite of\", never \"despite of\"."),
  E(3046,"err",2,"Find the error: (A) If I / (B) would have known, / (C) I would have / (D) come earlier.",
    ["A","B","C","D"],"Conditional form","The if-clause of a third conditional uses \"had known\", not \"would have known\"."),
  E(3047,"err",0,"Find the error: (A) Neither of / (B) the answers / (C) are / (D) correct.",
    ["A","B","C","D"],"Subject–verb agreement","\"Neither of\" takes a singular verb: \"is\", not \"are\"."),
  E(3048,"err",3,"Find the error: (A) She works / (B) very hardly / (C) to support / (D) her family.",
    ["A","B","C","D"],"Adverb form","The adverb of \"hard\" is \"hard\"; \"hardly\" means \"almost not\"."),
  E(3049,"err",1,"Find the error: (A) The team / (B) are winning / (C) all of / (D) its matches.",
    ["A","B","C","D"],"Collective noun agreement","With a singular \"its\", the verb should be \"is winning\"."),
  E(3050,"err",2,"Find the error: (A) I have been / (B) knowing him / (C) since / (D) childhood.",
    ["A","B","C","D"],"Stative verbs","\"Know\" is stative and is not used in the continuous: \"have known\"."),
  E(3051,"err",0,"Find the error: (A) He don't / (B) have any / (C) idea about / (D) the plan.",
    ["A","B","C","D"],"Auxiliary agreement","Third-person singular takes \"doesn't\", not \"don't\"."),
  E(3052,"err",3,"Find the error: (A) They discussed / (B) about the / (C) problem for / (D) two hours.",
    ["A","B","C","D"],"Transitive verbs","\"Discuss\" takes no preposition: \"discussed the problem\"."),
  E(3053,"err",1,"Find the error: (A) One of / (B) my friend / (C) is moving / (D) abroad.",
    ["A","B","C","D"],"\"One of\" + plural","\"One of\" is followed by a plural noun: \"my friends\"."),
  E(3054,"err",2,"Find the error: (A) The book / (B) which I / (C) borrowed it / (D) was excellent.",
    ["A","B","C","D"],"Redundant object","The relative clause already has an object; \"it\" is redundant."),
  E(3055,"err",0,"Find the error: (A) Me and my brother / (B) went / (C) to the / (D) market.",
    ["A","B","C","D"],"Subject pronoun","The subject should be \"My brother and I\"."),

  // ── Reading Comprehension (3056–3070) ──────────────────────────
  ...readingSet1(),
  ...readingSet2(),
  ...readingSet3(),
];

function readingSet1(): Question[] {
  const p =
    "Coral reefs cover less than one percent of the ocean floor, yet they support roughly a quarter of all marine species. " +
    "These \"rainforests of the sea\" thrive in warm, shallow water where sunlight reaches the algae that live inside coral tissue. " +
    "The algae supply the coral with food through photosynthesis, and in return the coral offers the algae shelter. " +
    "When ocean temperatures rise even slightly, the coral expels its algae and turns white, a process called bleaching. " +
    "A bleached reef is not dead, but it is starving, and if warm conditions persist the coral will not recover.";
  return [
    E(3056,"rea",1,"What is the main idea of the passage?",
      ["Coral reefs cover most of the ocean floor.","Coral reefs support many species but are sensitive to temperature.","Algae are harmful to coral.","Bleached reefs are already dead."],
      "Main idea","The passage stresses the reefs' rich life and their vulnerability to warming.", p),
    E(3057,"rea",2,"According to the passage, algae help coral by ____.",
      ["providing shelter","raising the temperature","supplying food through photosynthesis","turning the coral white"],
      "Detail","The text says algae supply the coral with food through photosynthesis.", p),
    E(3058,"rea",0,"The word \"bleaching\" refers to the process in which coral ____.",
      ["expels its algae and turns white","grows more quickly","absorbs more sunlight","produces new species"],
      "Vocabulary in context","Bleaching is defined as the coral expelling its algae and turning white.", p),
    E(3059,"rea",3,"It can be inferred that a bleached reef ____.",
      ["will always recover","is unaffected by temperature","has too much food","may die if warmth continues"],
      "Inference","The passage says coral will not recover if warm conditions persist.", p),
    E(3060,"rea",1,"Why does the author call reefs \"rainforests of the sea\"?",
      ["They are green in colour.","They host a great variety of life.","They are found on land.","They produce rain."],
      "Author's purpose","The comparison highlights the reefs' biodiversity, like rainforests.", p),
  ];
}

function readingSet2(): Question[] {
  const p =
    "In 1996, a quiet revolution began in Thailand's classrooms as schools started to introduce project-based learning. " +
    "Rather than memorising facts for a single exam, students worked in small teams to investigate real problems in their communities. " +
    "Teachers became guides instead of lecturers, and assessment focused on how well students could apply what they had learned. " +
    "Critics argued that the approach was difficult to grade fairly and demanded far more preparation. " +
    "Supporters countered that the skills it developed — cooperation, research, and communication — were exactly what employers wanted.";
  return [
    E(3061,"rea",2,"The passage is mainly about ____.",
      ["a new law banning exams","the history of Thai schools","a shift toward project-based learning","how to grade fairly"],
      "Main idea","The passage describes the move to project-based learning and the debate around it.", p),
    E(3062,"rea",0,"In project-based learning, teachers act as ____.",
      ["guides","examiners","lecturers","critics"],
      "Detail","The text states teachers became guides instead of lecturers.", p),
    E(3063,"rea",3,"Which was a criticism of the approach?",
      ["It developed useful skills.","Employers disliked it.","Students worked in teams.","It was hard to grade fairly."],
      "Detail","Critics argued the approach was difficult to grade fairly.", p),
    E(3064,"rea",1,"The word \"countered\" is closest in meaning to ____.",
      ["agreed","argued in response","remained silent","apologised"],
      "Vocabulary in context","\"Countered\" here means responded with an opposing argument.", p),
    E(3065,"rea",2,"Supporters valued the approach because it developed skills that ____.",
      ["helped students pass exams","were easy to grade","employers wanted","reduced teacher workload"],
      "Inference","Supporters said the skills were exactly what employers wanted.", p),
  ];
}

function readingSet3(): Question[] {
  const p =
    "The human brain uses about twenty percent of the body's energy, even though it makes up only two percent of body weight. " +
    "Much of this energy powers the constant electrical signalling between neurons, which continues even during sleep. " +
    "Researchers once assumed the sleeping brain simply rested, but modern imaging shows it is remarkably busy. " +
    "During deep sleep the brain clears waste products and strengthens the memories formed during the day. " +
    "This may explain why a good night's sleep so often improves both mood and learning.";
  return [
    E(3066,"rea",1,"What proportion of the body's energy does the brain use?",
      ["Two percent","About twenty percent","Half","None during sleep"],
      "Detail","The passage states the brain uses about twenty percent of the body's energy.", p),
    E(3067,"rea",3,"Researchers previously believed the sleeping brain ____.",
      ["cleared waste","strengthened memories","used more energy","simply rested"],
      "Detail","The text says researchers once assumed the sleeping brain simply rested.", p),
    E(3068,"rea",0,"During deep sleep, the brain ____.",
      ["clears waste and strengthens memories","stops all activity","uses no energy","forms no memories"],
      "Detail","Deep sleep clears waste products and strengthens memories.", p),
    E(3069,"rea",2,"The main purpose of the passage is to ____.",
      ["describe how to sleep better","criticise researchers","explain how active the sleeping brain is","measure body weight"],
      "Author's purpose","The passage explains that the sleeping brain is surprisingly busy.", p),
    E(3070,"rea",1,"It can be inferred that losing sleep may ____.",
      ["save energy","harm mood and learning","clear more waste","have no effect"],
      "Inference","Since sleep improves mood and learning, losing it likely harms them.", p),
  ];
}
