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

  // ── Grammar, set 2 (3071–3090) ─────────────────────────────────
  E(3071,"gra",2,"By next June, she ____ here for ten years.",
    ["will work","works","will have worked","is working"],"Future perfect","A duration completed by a future point uses the future perfect."),
  E(3072,"gra",1,"It's high time we ____ about the problem.",
    ["do something","did something","will do something","have done something"],"\"It's high time\" + past","\"It's high time\" is followed by the past subjunctive (did)."),
  E(3073,"gra",0,"The children were made ____ their homework before dinner.",
    ["to finish","finish","finishing","finished"],"Passive causative","In the passive, \"make\" takes the to-infinitive: were made to finish."),
  E(3074,"gra",3,"No sooner had he left ____ it started to rain.",
    ["when","that","then","than"],"\"No sooner … than\"","The correlative is \"no sooner … than\"."),
  E(3075,"gra",2,"She would rather you ____ smoke inside.",
    ["don't","won't","didn't","haven't"],"\"Would rather\" + past","\"Would rather\" about another person uses the past tense (didn't)."),
  E(3076,"gra",1,"A number of students ____ absent today.",
    ["is","are","was","has been"],"\"A number of\" agreement","\"A number of\" is plural and takes \"are\" (contrast: \"the number of\" is singular)."),
  E(3077,"gra",0,"He talks as though he ____ everything.",
    ["knew","knows","has known","will know"],"\"As though\" + unreal past","\"As though\" for something untrue uses the past (knew)."),
  E(3078,"gra",3,"Only after the meeting ended ____ the truth.",
    ["I learned","learned I","I had learned","did I learn"],"Inversion after \"only after\"","A fronted \"only after\" clause inverts subject and auxiliary: did I learn."),
  E(3079,"gra",2,"The more you practise, ____.",
    ["you get better","better you get","the better you get","the more better you get"],"Double comparative","The pattern is \"the + comparative …, the + comparative …\"."),
  E(3080,"gra",1,"I'd rather walk ____ take the bus.",
    ["to","than","that","then"],"\"Would rather … than\"","\"Would rather\" pairs with \"than\"."),
  E(3081,"gra",0,"Scarcely had she spoken ____ the crowd fell silent.",
    ["when","than","then","that"],"\"Scarcely … when\"","The correlative is \"scarcely … when\"."),
  E(3082,"gra",3,"If you ____ any questions, feel free to ask.",
    ["will have","had","would have","have"],"Zero/first conditional","A real present possibility uses the present simple (have)."),
  E(3083,"gra",2,"The house ____ we bought last year needs repairs.",
    ["who","whom","that","what"],"Relative pronouns","A defining clause about a thing uses \"that\" (or \"which\")."),
  E(3084,"gra",1,"Rarely ____ such a beautiful sunset.",
    ["I have seen","have I seen","I saw","did I saw"],"Inversion after \"rarely\"","Fronted \"rarely\" inverts subject and auxiliary: have I seen."),
  E(3085,"gra",0,"You had better ____ late again.",
    ["not be","not to be","don't be","not being"],"\"Had better\" + base verb","\"Had better\" takes the bare infinitive; the negative is \"had better not be\"."),
  E(3086,"gra",2,"She denied ____ the money.",
    ["to take","take","taking","taken"],"Gerund after \"deny\"","\"Deny\" is followed by a gerund (taking)."),
  E(3087,"gra",3,"They objected ____ the new rule.",
    ["against","with","for","to"],"Dependent prepositions","\"Object\" is followed by \"to\"."),
  E(3088,"gra",1,"Had I known earlier, I ____ differently.",
    ["would act","would have acted","had acted","will act"],"Inverted third conditional","\"Had I known\" (= if I had known) pairs with \"would have acted\"."),
  E(3089,"gra",0,"Little ____ that he was being watched.",
    ["did he know","he knew","he did know","knew he"],"Inversion after \"little\"","Fronted \"little\" inverts subject and auxiliary: did he know."),
  E(3090,"gra",2,"The teacher insisted that every student ____ present.",
    ["is","was","be","will be"],"Subjunctive after \"insist\"","\"Insist that\" takes the base-form subjunctive (be)."),

  // ── Vocabulary, set 2 (3091–3110) ──────────────────────────────
  E(3091,"voc",1,"Choose the word closest in meaning to \"benevolent\".",
    ["cruel","kind","wealthy","strict"],"Synonyms","\"Benevolent\" means well-meaning and kindly."),
  E(3092,"voc",2,"Choose the word opposite in meaning to \"diligent\".",
    ["hardworking","careful","lazy","clever"],"Antonyms","\"Diligent\" (hardworking) is the opposite of \"lazy\"."),
  E(3093,"voc",0,"His explanation was so ____ that no one could follow it.",
    ["convoluted","lucid","concise","plain"],"Context clues","\"Convoluted\" means extremely complex, fitting an unfollowable explanation."),
  E(3094,"voc",3,"To \"alleviate\" pain is to ____ it.",
    ["increase","cause","hide","relieve"],"Verb meaning","\"Alleviate\" means to make less severe = relieve."),
  E(3095,"voc",1,"A \"gregarious\" person enjoys ____.",
    ["being alone","company","silence","reading"],"Word meaning","\"Gregarious\" means sociable and fond of company."),
  E(3096,"voc",2,"Choose the word closest in meaning to \"candid\".",
    ["secretive","rude","frank","shy"],"Synonyms","\"Candid\" means truthful and straightforward = frank."),
  E(3097,"voc",0,"The politician's speech was full of ____ promises that meant nothing.",
    ["hollow","sincere","binding","modest"],"Context clues","\"Hollow\" promises are empty and meaningless."),
  E(3098,"voc",3,"To be \"resilient\" is to ____.",
    ["give up easily","stay weak","avoid change","recover quickly"],"Word meaning","\"Resilient\" means able to recover quickly from difficulties."),
  E(3099,"voc",1,"Choose the word opposite in meaning to \"expand\".",
    ["grow","contract","stretch","widen"],"Antonyms","\"Contract\" (shrink) is the opposite of \"expand\"."),
  E(3100,"voc",2,"A \"tentative\" plan is one that is ____.",
    ["final","detailed","not yet definite","approved"],"Word meaning","\"Tentative\" means provisional, not yet confirmed."),
  E(3101,"voc",0,"The detective remained ____ despite the confusing evidence.",
    ["composed","frantic","careless","confused"],"Positive connotation","\"Composed\" (calm and self-controlled) fits a capable detective."),
  E(3102,"voc",3,"To \"scrutinise\" a document is to ____ it.",
    ["ignore","sign","copy","examine closely"],"Verb meaning","\"Scrutinise\" means to examine in close detail."),
  E(3103,"voc",1,"Choose the word closest in meaning to \"abundant\".",
    ["rare","plentiful","expensive","hidden"],"Synonyms","\"Abundant\" means existing in large quantities = plentiful."),
  E(3104,"voc",2,"His \"arrogant\" attitude made him few friends. \"Arrogant\" means ____.",
    ["humble","generous","overly proud","quiet"],"Word meaning","\"Arrogant\" means having an exaggerated sense of self-importance."),
  E(3105,"voc",0,"The evidence was too ____ to convict anyone.",
    ["flimsy","solid","conclusive","strong"],"Context clues","\"Flimsy\" evidence is weak and insubstantial."),
  E(3106,"voc",3,"To \"comply\" with a rule is to ____ it.",
    ["break","question","ignore","obey"],"Verb meaning","\"Comply\" means to act in accordance with a rule = obey."),
  E(3107,"voc",1,"A \"vast\" desert is ____.",
    ["small","enormous","fertile","crowded"],"Word meaning","\"Vast\" means immense in size."),
  E(3108,"voc",2,"Choose the word opposite in meaning to \"generous\".",
    ["kind","giving","stingy","warm"],"Antonyms","\"Stingy\" (unwilling to give) is the opposite of \"generous\"."),
  E(3109,"voc",0,"The new evidence was ____ in solving the case.",
    ["pivotal","trivial","useless","minor"],"Positive context","\"Pivotal\" means of crucial importance."),
  E(3110,"voc",3,"To be \"reluctant\" is to be ____.",
    ["eager","willing","excited","unwilling"],"Word meaning","\"Reluctant\" means unwilling and hesitant."),

  // ── Error Spotting, set 2 (3111–3125) ──────────────────────────
  E(3111,"err",2,"Find the error: (A) There is / (B) many reasons / (C) why the plan / (D) failed.",
    ["A","B","C","D"],"Subject–verb agreement","With plural \"reasons\", it should be \"There are\"."),
  E(3112,"err",1,"Find the error: (A) He is one / (B) of the most brilliant / (C) student in / (D) the class.",
    ["A","B","C","D"],"\"One of the\" + plural","\"One of the most brilliant\" needs a plural noun: \"students\"."),
  E(3113,"err",0,"Find the error: (A) Being a hot day, / (B) we decided / (C) to stay / (D) indoors.",
    ["A","B","C","D"],"Dangling modifier","\"Being a hot day\" cannot describe \"we\"; use \"It being a hot day\"."),
  E(3114,"err",3,"Find the error: (A) She sings / (B) more sweetly / (C) than / (D) any singer in the choir.",
    ["A","B","C","D"],"Comparison logic","She is in the choir, so it must be \"any other singer\"."),
  E(3115,"err",2,"Find the error: (A) Neither he / (B) nor his friends / (C) was / (D) invited.",
    ["A","B","C","D"],"Proximity agreement","The verb agrees with the nearer subject \"friends\": \"were\"."),
  E(3116,"err",1,"Find the error: (A) The jury / (B) were unanimous / (C) in its / (D) verdict.",
    ["A","B","C","D"],"Collective noun consistency","\"Were\" treats the jury as plural, so use \"their\", not \"its\" - the error is the mismatch at (B)/(C); mark (B)."),
  E(3117,"err",0,"Find the error: (A) Each boys / (B) was given / (C) a prize / (D) at the ceremony.",
    ["A","B","C","D"],"\"Each\" + singular","\"Each\" is followed by a singular noun: \"Each boy\"."),
  E(3118,"err",3,"Find the error: (A) I prefer / (B) tea / (C) more than / (D) coffee.",
    ["A","B","C","D"],"\"Prefer … to\"","\"Prefer\" is followed by \"to\", not \"more than\"."),
  E(3119,"err",2,"Find the error: (A) The scenery / (B) here are / (C) more beautiful / (D) than in the city.",
    ["A","B","C","D"],"Uncountable agreement","\"Scenery\" is uncountable: \"is\", not \"are\"."),
  E(3120,"err",1,"Find the error: (A) He returned / (B) back home / (C) after / (D) a long journey.",
    ["A","B","C","D"],"Redundancy","\"Returned\" already implies \"back\"; \"returned back\" is redundant."),
  E(3121,"err",0,"Find the error: (A) Everyone / (B) have completed / (C) the / (D) assignment.",
    ["A","B","C","D"],"Indefinite pronoun agreement","\"Everyone\" is singular: \"has completed\"."),
  E(3122,"err",3,"Find the error: (A) She is senior / (B) than me / (C) by two / (D) years.",
    ["A","B","C","D"],"\"Senior to\"","\"Senior\" takes \"to\": \"senior to me\"."),
  E(3123,"err",2,"Find the error: (A) The list of / (B) items / (C) were / (D) very long.",
    ["A","B","C","D"],"Agreement with head noun","The subject is \"list\" (singular): \"was\"."),
  E(3124,"err",1,"Find the error: (A) He gave / (B) me an advice / (C) that I / (D) never forgot.",
    ["A","B","C","D"],"Uncountable nouns","\"Advice\" is uncountable: \"a piece of advice\", not \"an advice\"."),
  E(3125,"err",0,"Find the error: (A) Neither of the / (B) two proposals / (C) were / (D) accepted.",
    ["A","B","C","D"],"\"Neither of\" agreement","\"Neither of\" takes a singular verb: \"was\"."),

  // ── Reading Comprehension ──────────────────────────────────────
  ...readingSet1(),
  ...readingSet2(),
  ...readingSet3(),
  ...readingSet4(),
  ...readingSet5(),
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

function readingSet4(): Question[] {
  const p =
    "Electric vehicles are often praised as a clean alternative to petrol cars, but their true impact depends on how their electricity is generated. " +
    "In a country powered mainly by coal, charging an electric car can produce almost as much carbon as burning fuel directly. " +
    "Where electricity comes from wind, solar, or hydropower, however, the same car becomes dramatically cleaner over its lifetime. " +
    "Manufacturing the battery also carries an environmental cost, one that is repaid only after the vehicle has been driven for several years. " +
    "The lesson is that a technology is only as green as the system that supports it.";
  return [
    E(3126,"rea",1,"The main point of the passage is that electric vehicles ____.",
      ["are always clean","are only as clean as their electricity source","are worse than petrol cars","cannot be recycled"],
      "Main idea","The passage argues an EV's cleanliness depends on how its electricity is generated.", p),
    E(3127,"rea",0,"In a coal-powered country, charging an electric car ____.",
      ["can produce nearly as much carbon as burning fuel","produces no carbon","is always cleaner","is impossible"],
      "Detail","The text says charging can produce almost as much carbon as burning fuel directly.", p),
    E(3128,"rea",2,"The environmental cost of the battery is repaid ____.",
      ["immediately","never","after several years of driving","only in sunny countries"],
      "Detail","Battery manufacturing cost is repaid only after several years of driving.", p),
    E(3129,"rea",3,"The phrase \"only as green as the system that supports it\" suggests that ____.",
      ["all systems are equal","electric cars are useless","batteries never wear out","context determines benefit"],
      "Inference","The line means the surrounding system determines how beneficial the technology is.", p),
    E(3130,"rea",1,"The author's attitude toward electric vehicles is best described as ____.",
      ["entirely negative","balanced and conditional","uncritically enthusiastic","indifferent"],
      "Tone","The author weighs pros and cons, making the view balanced and conditional.", p),
  ];
}

function readingSet5(): Question[] {
  const p =
    "For centuries, mapmakers filled the unknown edges of their charts with sea monsters and warnings. " +
    "These images were not merely decorative; they marked the limits of reliable knowledge and cautioned sailors against straying too far. " +
    "As exploration advanced, the monsters retreated and blank spaces filled with coastlines and currents. " +
    "Yet historians note that the maps never became truly empty of imagination, for every projection distorts the round Earth in some way. " +
    "A map, in the end, is an argument about what matters, not a perfect mirror of the world.";
  return [
    E(3131,"rea",2,"According to the passage, sea monsters on old maps mainly ____.",
      ["decorated the borders","frightened children","marked the limits of knowledge","showed real animals"],
      "Detail","The images marked the limits of reliable knowledge and warned sailors.", p),
    E(3132,"rea",0,"As exploration advanced, the monsters ____.",
      ["retreated","multiplied","stayed the same","moved to the centre"],
      "Detail","The passage says the monsters retreated as blank spaces filled in.", p),
    E(3133,"rea",3,"Why does the author say maps never became \"truly empty of imagination\"?",
      ["Sailors liked the art","Monsters returned","Maps were never finished","Every projection distorts the Earth"],
      "Inference","Because every flat projection distorts the round Earth, some interpretation remains.", p),
    E(3134,"rea",1,"The statement that a map is \"an argument about what matters\" means a map ____.",
      ["is always wrong","reflects choices about what to show","cannot be trusted","is purely decorative"],
      "Author's purpose","It means mapmakers choose what to emphasise, so a map reflects priorities.", p),
    E(3135,"rea",2,"The passage is mainly concerned with ____.",
      ["how to draw sea monsters","the dangers of sailing","what maps reveal about knowledge and choice","the shape of the Earth"],
      "Main idea","The passage explores what maps reveal about the limits of knowledge and human choices.", p),
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
