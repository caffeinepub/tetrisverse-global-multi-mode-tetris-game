import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "ja"
  | "ko"
  | "tr";

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
  tr: "Türkçe",
};

export interface Translations {
  // Navigation
  play: string;
  leaderboard: string;
  missions: string;
  settings: string;
  back: string;
  // Game
  score: string;
  level: string;
  lines: string;
  combo: string;
  time: string;
  moves: string;
  paused: string;
  gameOver: string;
  youWin: string;
  restart: string;
  menu: string;
  resume: string;
  // Modes
  selectMode: string;
  classic: string;
  timeAttack: string;
  endless: string;
  challenge: string;
  puzzle: string;
  insanity: string;
  mirror: string;
  mirrorMode: string;
  gravityShift: string;
  comboRush: string;
  // Settings
  theme: string;
  language: string;
  sound: string;
  audio: string;
  music: string;
  mute: string;
  unmute: string;
  // Leaderboard
  rank: string;
  player: string;
  date: string;
  noScores: string;
  submitScore: string;
  enterName: string;
  // Missions
  missionsTitle: string;
  progress: string;
  completed: string;
  reward: string;
  anyMode: string;
  mission1Desc: string;
  mission2Desc: string;
  mission3Desc: string;
  mission4Desc: string;
  mission5Desc: string;
  mission6Desc: string;
  mission7Desc: string;
  mission8Desc: string;
  rewardRetroTheme: string;
  rewardScoreMultiplier: string;
  rewardSpaceTheme: string;
  rewardComboRushBadge: string;
  rewardOceanTheme: string;
  rewardGravityBadge: string;
  rewardMirrorBadge: string;
  rewardInsanityBadge: string;
  // Mode descriptions
  classicDesc: string;
  timeAttackDesc: string;
  endlessDesc: string;
  challengeDesc: string;
  puzzleDesc: string;
  insanityDesc: string;
  mirrorDesc: string;
  gravityShiftDesc: string;
  comboRushDesc: string;
  // Difficulty labels
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  diffExpert: string;
  diffInsane: string;
  // Game Over
  finalScore: string;
  linesCleared: string;
  playAgain: string;
  // Footer
  privacyPolicy: string;
  builtWith: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    play: "Play",
    leaderboard: "Leaderboard",
    missions: "Missions",
    settings: "Settings",
    back: "Back",
    score: "Score",
    level: "Level",
    lines: "Lines",
    combo: "Combo",
    time: "Time",
    moves: "Moves",
    paused: "Pause",
    gameOver: "Game Over",
    youWin: "You Win!",
    restart: "Restart",
    menu: "Menu",
    resume: "Resume",
    selectMode: "Select Mode",
    classic: "Classic",
    timeAttack: "Time Attack",
    endless: "Endless",
    challenge: "Challenge",
    puzzle: "Puzzle",
    insanity: "Insanity",
    mirror: "Mirror Mode",
    mirrorMode: "Mirror Mode",
    gravityShift: "Gravity Shift",
    comboRush: "Combo Rush",
    theme: "Theme",
    language: "Language",
    sound: "Sound",
    audio: "Audio",
    music: "Music",
    mute: "Mute",
    unmute: "Unmute",
    rank: "Rank",
    player: "Player",
    date: "Date",
    noScores: "No scores yet. Be the first!",
    submitScore: "Submit Score",
    enterName: "Enter your name",
    missionsTitle: "Missions",
    progress: "Progress",
    completed: "Completed",
    reward: "Reward",
    anyMode: "Any Mode",
    mission1Desc: "Clear 50 lines in Classic mode",
    mission2Desc: "Reach 10,000 points in any mode",
    mission3Desc: "Survive 2 minutes in Time Attack",
    mission4Desc: "Achieve a 5x combo in Combo Rush",
    mission5Desc: "Complete 3 Puzzle levels",
    mission6Desc: "Clear 20 lines in Gravity Shift mode",
    mission7Desc: "Score 5,000 points in Mirror Mode",
    mission8Desc: "Survive to level 5 in Insanity mode",
    rewardRetroTheme: "Retro Theme Unlock",
    rewardScoreMultiplier: "Score Multiplier x2",
    rewardSpaceTheme: "Space Theme Unlock",
    rewardComboRushBadge: "Combo Rush Badge",
    rewardOceanTheme: "Ocean Theme Unlock",
    rewardGravityBadge: "Gravity Shift Badge",
    rewardMirrorBadge: "Mirror Mode Badge",
    rewardInsanityBadge: "Insanity Badge",
    classicDesc:
      "The original Tetris experience. Clear lines to score points and level up.",
    timeAttackDesc:
      "Race against the clock! Clear as many lines as possible before time runs out.",
    endlessDesc: "Play forever with no game over. Relax and enjoy the flow.",
    challengeDesc:
      "Overcome obstacles! Random garbage rows appear to test your skills.",
    puzzleDesc:
      "Solve the puzzle! Clear all blocks with a limited number of moves.",
    insanityDesc:
      "Extreme speed and random piece orientations. Only the best survive!",
    mirrorDesc: "Controls are reversed! Left is right and right is left.",
    gravityShiftDesc:
      "Gravity alternates direction! Pieces fall up and down alternately.",
    comboRushDesc:
      "Chain combos for massive multipliers! Keep the streak alive.",
    diffEasy: "Easy",
    diffMedium: "Medium",
    diffHard: "Hard",
    diffExpert: "Expert",
    diffInsane: "Insane",
    finalScore: "Final Score",
    linesCleared: "Lines Cleared",
    playAgain: "Play Again",
    privacyPolicy: "Privacy Policy",
    builtWith: "Built with",
  },
  es: {
    play: "Jugar",
    leaderboard: "Clasificación",
    missions: "Misiones",
    settings: "Ajustes",
    back: "Atrás",
    score: "Puntuación",
    level: "Nivel",
    lines: "Líneas",
    combo: "Combo",
    time: "Tiempo",
    moves: "Movimientos",
    paused: "Pausar",
    gameOver: "Fin del Juego",
    youWin: "¡Ganaste!",
    restart: "Reiniciar",
    menu: "Menú",
    resume: "Continuar",
    selectMode: "Seleccionar Modo",
    classic: "Clásico",
    timeAttack: "Contrarreloj",
    endless: "Sin Fin",
    challenge: "Desafío",
    puzzle: "Puzzle",
    insanity: "Locura",
    mirror: "Modo Espejo",
    mirrorMode: "Modo Espejo",
    gravityShift: "Cambio de Gravedad",
    comboRush: "Combo Rush",
    theme: "Tema",
    language: "Idioma",
    sound: "Sonido",
    audio: "Audio",
    music: "Música",
    mute: "Silenciar",
    unmute: "Activar Sonido",
    rank: "Rango",
    player: "Jugador",
    date: "Fecha",
    noScores: "Sin puntuaciones. ¡Sé el primero!",
    submitScore: "Enviar Puntuación",
    enterName: "Ingresa tu nombre",
    missionsTitle: "Misiones",
    progress: "Progreso",
    completed: "Completado",
    reward: "Recompensa",
    anyMode: "Cualquier Modo",
    mission1Desc: "Elimina 50 líneas en modo Clásico",
    mission2Desc: "Alcanza 10.000 puntos en cualquier modo",
    mission3Desc: "Sobrevive 2 minutos en Contrarreloj",
    mission4Desc: "Logra un combo x5 en Combo Rush",
    mission5Desc: "Completa 3 niveles de Puzzle",
    mission6Desc: "Elimina 20 líneas en modo Cambio de Gravedad",
    mission7Desc: "Consigue 5.000 puntos en Modo Espejo",
    mission8Desc: "Sobrevive hasta el nivel 5 en modo Locura",
    rewardRetroTheme: "Desbloqueo Tema Retro",
    rewardScoreMultiplier: "Multiplicador de Puntos x2",
    rewardSpaceTheme: "Desbloqueo Tema Espacial",
    rewardComboRushBadge: "Insignia Combo Rush",
    rewardOceanTheme: "Desbloqueo Tema Océano",
    rewardGravityBadge: "Insignia Cambio de Gravedad",
    rewardMirrorBadge: "Insignia Modo Espejo",
    rewardInsanityBadge: "Insignia Locura",
    classicDesc:
      "La experiencia Tetris original. Limpia líneas para conseguir puntos.",
    timeAttackDesc:
      "¡Corre contra el reloj! Limpia el máximo de líneas antes de que se acabe el tiempo.",
    endlessDesc: "Juega para siempre sin fin de partida. Relájate y disfruta.",
    challengeDesc:
      "¡Supera los obstáculos! Aparecen filas de basura aleatorias.",
    puzzleDesc:
      "¡Resuelve el puzzle! Limpia todos los bloques con movimientos limitados.",
    insanityDesc:
      "Velocidad extrema y orientaciones aleatorias. ¡Solo los mejores sobreviven!",
    mirrorDesc:
      "¡Los controles están invertidos! Izquierda es derecha y derecha es izquierda.",
    gravityShiftDesc:
      "¡La gravedad cambia de dirección! Las piezas caen arriba y abajo alternativamente.",
    comboRushDesc:
      "¡Encadena combos para multiplicadores masivos! Mantén la racha.",
    diffEasy: "Fácil",
    diffMedium: "Medio",
    diffHard: "Difícil",
    diffExpert: "Experto",
    diffInsane: "Insano",
    finalScore: "Puntuación Final",
    linesCleared: "Líneas Eliminadas",
    playAgain: "Jugar de Nuevo",
    privacyPolicy: "Política de Privacidad",
    builtWith: "Construido con",
  },
  fr: {
    play: "Jouer",
    leaderboard: "Classement",
    missions: "Missions",
    settings: "Paramètres",
    back: "Retour",
    score: "Score",
    level: "Niveau",
    lines: "Lignes",
    combo: "Combo",
    time: "Temps",
    moves: "Mouvements",
    paused: "Pause",
    gameOver: "Partie Terminée",
    youWin: "Vous Gagnez!",
    restart: "Recommencer",
    menu: "Menu",
    resume: "Reprendre",
    selectMode: "Choisir le Mode",
    classic: "Classique",
    timeAttack: "Contre la Montre",
    endless: "Sans Fin",
    challenge: "Défi",
    puzzle: "Puzzle",
    insanity: "Folie",
    mirror: "Mode Miroir",
    mirrorMode: "Mode Miroir",
    gravityShift: "Changement de Gravité",
    comboRush: "Combo Rush",
    theme: "Thème",
    language: "Langue",
    sound: "Son",
    audio: "Audio",
    music: "Musique",
    mute: "Muet",
    unmute: "Activer le Son",
    rank: "Rang",
    player: "Joueur",
    date: "Date",
    noScores: "Pas encore de scores. Soyez le premier!",
    submitScore: "Soumettre le Score",
    enterName: "Entrez votre nom",
    missionsTitle: "Missions",
    progress: "Progrès",
    completed: "Terminé",
    reward: "Récompense",
    anyMode: "N'importe quel mode",
    mission1Desc: "Effacez 50 lignes en mode Classique",
    mission2Desc: "Atteignez 10 000 points dans n'importe quel mode",
    mission3Desc: "Survivez 2 minutes en Contre la Montre",
    mission4Desc: "Réalisez un combo x5 en Combo Rush",
    mission5Desc: "Terminez 3 niveaux de Puzzle",
    mission6Desc: "Effacez 20 lignes en mode Changement de Gravité",
    mission7Desc: "Marquez 5 000 points en Mode Miroir",
    mission8Desc: "Survivez jusqu'au niveau 5 en mode Folie",
    rewardRetroTheme: "Déblocage Thème Rétro",
    rewardScoreMultiplier: "Multiplicateur de Score x2",
    rewardSpaceTheme: "Déblocage Thème Spatial",
    rewardComboRushBadge: "Badge Combo Rush",
    rewardOceanTheme: "Déblocage Thème Océan",
    rewardGravityBadge: "Badge Changement de Gravité",
    rewardMirrorBadge: "Badge Mode Miroir",
    rewardInsanityBadge: "Badge Folie",
    classicDesc:
      "L'expérience Tetris originale. Effacez des lignes pour marquer des points.",
    timeAttackDesc:
      "Battez la montre ! Effacez le plus de lignes possible avant la fin du temps.",
    endlessDesc:
      "Jouez indéfiniment sans fin de partie. Détendez-vous et profitez.",
    challengeDesc:
      "Surmontez les obstacles ! Des rangées de déchets apparaissent aléatoirement.",
    puzzleDesc:
      "Résolvez le puzzle ! Effacez tous les blocs avec un nombre limité de mouvements.",
    insanityDesc:
      "Vitesse extrême et orientations aléatoires. Seuls les meilleurs survivent !",
    mirrorDesc:
      "Les contrôles sont inversés ! Gauche c'est droite et droite c'est gauche.",
    gravityShiftDesc:
      "La gravité alterne de direction ! Les pièces tombent alternativement vers le haut et le bas.",
    comboRushDesc:
      "Enchaînez les combos pour des multiplicateurs massifs ! Maintenez la série.",
    diffEasy: "Facile",
    diffMedium: "Moyen",
    diffHard: "Difficile",
    diffExpert: "Expert",
    diffInsane: "Fou",
    finalScore: "Score Final",
    linesCleared: "Lignes Effacées",
    playAgain: "Rejouer",
    privacyPolicy: "Politique de Confidentialité",
    builtWith: "Construit avec",
  },
  de: {
    play: "Spielen",
    leaderboard: "Bestenliste",
    missions: "Missionen",
    settings: "Einstellungen",
    back: "Zurück",
    score: "Punkte",
    level: "Level",
    lines: "Linien",
    combo: "Kombo",
    time: "Zeit",
    moves: "Züge",
    paused: "Pause",
    gameOver: "Spiel Vorbei",
    youWin: "Du Gewinnst!",
    restart: "Neustart",
    menu: "Menü",
    resume: "Fortsetzen",
    selectMode: "Modus Wählen",
    classic: "Klassisch",
    timeAttack: "Zeitangriff",
    endless: "Endlos",
    challenge: "Herausforderung",
    puzzle: "Puzzle",
    insanity: "Wahnsinn",
    mirror: "Spiegelmodus",
    mirrorMode: "Spiegelmodus",
    gravityShift: "Gravitationswechsel",
    comboRush: "Kombo Rush",
    theme: "Thema",
    language: "Sprache",
    sound: "Ton",
    audio: "Audio",
    music: "Musik",
    mute: "Stumm",
    unmute: "Ton An",
    rank: "Rang",
    player: "Spieler",
    date: "Datum",
    noScores: "Noch keine Punkte. Sei der Erste!",
    submitScore: "Punkte Einreichen",
    enterName: "Gib deinen Namen ein",
    missionsTitle: "Missionen",
    progress: "Fortschritt",
    completed: "Abgeschlossen",
    reward: "Belohnung",
    anyMode: "Beliebiger Modus",
    mission1Desc: "Lösche 50 Linien im Klassisch-Modus",
    mission2Desc: "Erreiche 10.000 Punkte in einem beliebigen Modus",
    mission3Desc: "Überlebe 2 Minuten im Zeitangriff",
    mission4Desc: "Erreiche ein 5-faches Kombo in Kombo Rush",
    mission5Desc: "Schließe 3 Puzzle-Level ab",
    mission6Desc: "Lösche 20 Linien im Gravitationswechsel-Modus",
    mission7Desc: "Erziele 5.000 Punkte im Spiegelmodus",
    mission8Desc: "Überlebe bis Level 5 im Wahnsinn-Modus",
    rewardRetroTheme: "Retro-Thema freischalten",
    rewardScoreMultiplier: "Punktemultiplikator x2",
    rewardSpaceTheme: "Weltraum-Thema freischalten",
    rewardComboRushBadge: "Kombo Rush Abzeichen",
    rewardOceanTheme: "Ozean-Thema freischalten",
    rewardGravityBadge: "Gravitationswechsel Abzeichen",
    rewardMirrorBadge: "Spiegelmodus Abzeichen",
    rewardInsanityBadge: "Wahnsinn Abzeichen",
    classicDesc:
      "Das originale Tetris-Erlebnis. Lösche Linien, um Punkte zu sammeln.",
    timeAttackDesc:
      "Wettlauf gegen die Zeit! Lösche so viele Linien wie möglich, bevor die Zeit abläuft.",
    endlessDesc: "Spiele ohne Ende. Entspann dich und genieß den Spielfluss.",
    challengeDesc:
      "Überwinde Hindernisse! Zufällige Schrottzeilen erscheinen, um dich zu testen.",
    puzzleDesc:
      "Löse das Puzzle! Lösche alle Blöcke mit einer begrenzten Anzahl an Zügen.",
    insanityDesc:
      "Extreme Geschwindigkeit und zufällige Ausrichtungen. Nur die Besten überleben!",
    mirrorDesc:
      "Die Steuerung ist umgekehrt! Links ist rechts und rechts ist links.",
    gravityShiftDesc:
      "Die Schwerkraft wechselt die Richtung! Steine fallen abwechselnd nach oben und unten.",
    comboRushDesc:
      "Verkette Kombos für massive Multiplikatoren! Halte die Serie am Laufen.",
    diffEasy: "Leicht",
    diffMedium: "Mittel",
    diffHard: "Schwer",
    diffExpert: "Experte",
    diffInsane: "Wahnsinn",
    finalScore: "Endpunktzahl",
    linesCleared: "Linien Gelöscht",
    playAgain: "Nochmal Spielen",
    privacyPolicy: "Datenschutzrichtlinie",
    builtWith: "Gebaut mit",
  },
  it: {
    play: "Gioca",
    leaderboard: "Classifica",
    missions: "Missioni",
    settings: "Impostazioni",
    back: "Indietro",
    score: "Punteggio",
    level: "Livello",
    lines: "Linee",
    combo: "Combo",
    time: "Tempo",
    moves: "Mosse",
    paused: "Pausa",
    gameOver: "Partita Finita",
    youWin: "Hai Vinto!",
    restart: "Ricomincia",
    menu: "Menu",
    resume: "Riprendi",
    selectMode: "Seleziona Modalità",
    classic: "Classico",
    timeAttack: "Attacco a Tempo",
    endless: "Infinito",
    challenge: "Sfida",
    puzzle: "Puzzle",
    insanity: "Follia",
    mirror: "Modalità Specchio",
    mirrorMode: "Modalità Specchio",
    gravityShift: "Cambio Gravità",
    comboRush: "Combo Rush",
    theme: "Tema",
    language: "Lingua",
    sound: "Suono",
    audio: "Audio",
    music: "Musica",
    mute: "Muto",
    unmute: "Attiva Suono",
    rank: "Posizione",
    player: "Giocatore",
    date: "Data",
    noScores: "Nessun punteggio. Sii il primo!",
    submitScore: "Invia Punteggio",
    enterName: "Inserisci il tuo nome",
    missionsTitle: "Missioni",
    progress: "Progresso",
    completed: "Completato",
    reward: "Ricompensa",
    anyMode: "Qualsiasi Modalità",
    mission1Desc: "Cancella 50 linee in modalità Classica",
    mission2Desc: "Raggiungi 10.000 punti in qualsiasi modalità",
    mission3Desc: "Sopravvivi 2 minuti nell'Attacco a Tempo",
    mission4Desc: "Realizza un combo x5 in Combo Rush",
    mission5Desc: "Completa 3 livelli di Puzzle",
    mission6Desc: "Cancella 20 linee in modalità Cambio Gravità",
    mission7Desc: "Ottieni 5.000 punti in Modalità Specchio",
    mission8Desc: "Sopravvivi fino al livello 5 in modalità Follia",
    rewardRetroTheme: "Sblocco Tema Retro",
    rewardScoreMultiplier: "Moltiplicatore Punteggio x2",
    rewardSpaceTheme: "Sblocco Tema Spazio",
    rewardComboRushBadge: "Badge Combo Rush",
    rewardOceanTheme: "Sblocco Tema Oceano",
    rewardGravityBadge: "Badge Cambio Gravità",
    rewardMirrorBadge: "Badge Modalità Specchio",
    rewardInsanityBadge: "Badge Follia",
    classicDesc:
      "L'esperienza Tetris originale. Cancella linee per fare punti.",
    timeAttackDesc:
      "Corsa contro il tempo! Cancella più linee possibili prima che scada.",
    endlessDesc:
      "Gioca all'infinito senza fine partita. Rilassati e goditi il flusso.",
    challengeDesc: "Supera gli ostacoli! Appaiono righe spazzatura casuali.",
    puzzleDesc:
      "Risolvi il puzzle! Cancella tutti i blocchi con mosse limitate.",
    insanityDesc:
      "Velocità estrema e orientazioni casuali. Solo i migliori sopravvivono!",
    mirrorDesc:
      "I controlli sono invertiti! Sinistra è destra e destra è sinistra.",
    gravityShiftDesc:
      "La gravità alterna direzione! I pezzi cadono alternativamente su e giù.",
    comboRushDesc:
      "Concatena combo per moltiplicatori enormi! Mantieni la serie.",
    diffEasy: "Facile",
    diffMedium: "Medio",
    diffHard: "Difficile",
    diffExpert: "Esperto",
    diffInsane: "Folle",
    finalScore: "Punteggio Finale",
    linesCleared: "Linee Cancellate",
    playAgain: "Gioca Ancora",
    privacyPolicy: "Informativa sulla Privacy",
    builtWith: "Costruito con",
  },
  pt: {
    play: "Jogar",
    leaderboard: "Classificação",
    missions: "Missões",
    settings: "Configurações",
    back: "Voltar",
    score: "Pontuação",
    level: "Nível",
    lines: "Linhas",
    combo: "Combo",
    time: "Tempo",
    moves: "Movimentos",
    paused: "Pausar",
    gameOver: "Fim de Jogo",
    youWin: "Você Ganhou!",
    restart: "Reiniciar",
    menu: "Menu",
    resume: "Continuar",
    selectMode: "Selecionar Modo",
    classic: "Clássico",
    timeAttack: "Contra o Tempo",
    endless: "Infinito",
    challenge: "Desafio",
    puzzle: "Puzzle",
    insanity: "Insanidade",
    mirror: "Modo Espelho",
    mirrorMode: "Modo Espelho",
    gravityShift: "Mudança de Gravidade",
    comboRush: "Combo Rush",
    theme: "Tema",
    language: "Idioma",
    sound: "Som",
    audio: "Áudio",
    music: "Música",
    mute: "Silenciar",
    unmute: "Ativar Som",
    rank: "Posição",
    player: "Jogador",
    date: "Data",
    noScores: "Sem pontuações. Seja o primeiro!",
    submitScore: "Enviar Pontuação",
    enterName: "Digite seu nome",
    missionsTitle: "Missões",
    progress: "Progresso",
    completed: "Concluído",
    reward: "Recompensa",
    anyMode: "Qualquer Modo",
    mission1Desc: "Elimine 50 linhas no modo Clássico",
    mission2Desc: "Alcance 10.000 pontos em qualquer modo",
    mission3Desc: "Sobreviva 2 minutos no Contra o Tempo",
    mission4Desc: "Alcance um combo x5 no Combo Rush",
    mission5Desc: "Complete 3 níveis de Puzzle",
    mission6Desc: "Elimine 20 linhas no modo Mudança de Gravidade",
    mission7Desc: "Marque 5.000 pontos no Modo Espelho",
    mission8Desc: "Sobreviva até o nível 5 no modo Insanidade",
    rewardRetroTheme: "Desbloqueio Tema Retro",
    rewardScoreMultiplier: "Multiplicador de Pontuação x2",
    rewardSpaceTheme: "Desbloqueio Tema Espacial",
    rewardComboRushBadge: "Distintivo Combo Rush",
    rewardOceanTheme: "Desbloqueio Tema Oceano",
    rewardGravityBadge: "Distintivo Mudança de Gravidade",
    rewardMirrorBadge: "Distintivo Modo Espelho",
    rewardInsanityBadge: "Distintivo Insanidade",
    classicDesc:
      "A experiência Tetris original. Elimine linhas para marcar pontos.",
    timeAttackDesc:
      "Corra contra o relógio! Elimine o máximo de linhas antes do tempo acabar.",
    endlessDesc: "Jogue para sempre sem fim de jogo. Relaxe e aproveite.",
    challengeDesc: "Supere os obstáculos! Linhas de lixo aleatórias aparecem.",
    puzzleDesc:
      "Resolva o puzzle! Elimine todos os blocos com movimentos limitados.",
    insanityDesc:
      "Velocidade extrema e orientações aleatórias. Só os melhores sobrevivem!",
    mirrorDesc:
      "Os controles são invertidos! Esquerda é direita e direita é esquerda.",
    gravityShiftDesc:
      "A gravidade muda de direção! As peças caem alternadamente para cima e para baixo.",
    comboRushDesc:
      "Encadeie combos para multiplicadores massivos! Mantenha a sequência.",
    diffEasy: "Fácil",
    diffMedium: "Médio",
    diffHard: "Difícil",
    diffExpert: "Especialista",
    diffInsane: "Insano",
    finalScore: "Pontuação Final",
    linesCleared: "Linhas Eliminadas",
    playAgain: "Jogar Novamente",
    privacyPolicy: "Política de Privacidade",
    builtWith: "Construído com",
  },
  ru: {
    play: "Играть",
    leaderboard: "Рейтинг",
    missions: "Миссии",
    settings: "Настройки",
    back: "Назад",
    score: "Счёт",
    level: "Уровень",
    lines: "Линии",
    combo: "Комбо",
    time: "Время",
    moves: "Ходы",
    paused: "Пауза",
    gameOver: "Игра Окончена",
    youWin: "Вы Победили!",
    restart: "Перезапуск",
    menu: "Меню",
    resume: "Продолжить",
    selectMode: "Выбор Режима",
    classic: "Классика",
    timeAttack: "На Время",
    endless: "Бесконечный",
    challenge: "Испытание",
    puzzle: "Головоломка",
    insanity: "Безумие",
    mirror: "Зеркальный Режим",
    mirrorMode: "Зеркальный Режим",
    gravityShift: "Смена Гравитации",
    comboRush: "Комбо Раш",
    theme: "Тема",
    language: "Язык",
    sound: "Звук",
    audio: "Аудио",
    music: "Музыка",
    mute: "Без Звука",
    unmute: "Включить Звук",
    rank: "Ранг",
    player: "Игрок",
    date: "Дата",
    noScores: "Нет очков. Будьте первым!",
    submitScore: "Отправить Счёт",
    enterName: "Введите ваше имя",
    missionsTitle: "Миссии",
    progress: "Прогресс",
    completed: "Завершено",
    reward: "Награда",
    anyMode: "Любой Режим",
    mission1Desc: "Очистите 50 линий в режиме Классика",
    mission2Desc: "Наберите 10 000 очков в любом режиме",
    mission3Desc: "Продержитесь 2 минуты в режиме На Время",
    mission4Desc: "Выполните комбо x5 в Комбо Раш",
    mission5Desc: "Пройдите 3 уровня Головоломки",
    mission6Desc: "Очистите 20 линий в режиме Смена Гравитации",
    mission7Desc: "Наберите 5 000 очков в Зеркальном Режиме",
    mission8Desc: "Доживите до 5 уровня в режиме Безумие",
    rewardRetroTheme: "Разблокировка темы Ретро",
    rewardScoreMultiplier: "Множитель очков x2",
    rewardSpaceTheme: "Разблокировка космической темы",
    rewardComboRushBadge: "Значок Комбо Раш",
    rewardOceanTheme: "Разблокировка темы Океан",
    rewardGravityBadge: "Значок Смены Гравитации",
    rewardMirrorBadge: "Значок Зеркального Режима",
    rewardInsanityBadge: "Значок Безумие",
    classicDesc:
      "Оригинальный опыт Тетрис. Очищайте линии, чтобы набирать очки.",
    timeAttackDesc:
      "Гонка со временем! Очистите как можно больше линий до конца времени.",
    endlessDesc:
      "Играйте бесконечно без конца игры. Расслабьтесь и наслаждайтесь.",
    challengeDesc:
      "Преодолевайте препятствия! Появляются случайные мусорные ряды.",
    puzzleDesc:
      "Решите головоломку! Очистите все блоки за ограниченное число ходов.",
    insanityDesc:
      "Экстремальная скорость и случайные ориентации. Выживают только лучшие!",
    mirrorDesc: "Управление обратное! Влево — это вправо, а вправо — влево.",
    gravityShiftDesc:
      "Гравитация чередует направление! Фигуры падают попеременно вверх и вниз.",
    comboRushDesc:
      "Цепочки комбо для огромных множителей! Держите серию живой.",
    diffEasy: "Легко",
    diffMedium: "Средне",
    diffHard: "Сложно",
    diffExpert: "Эксперт",
    diffInsane: "Безумие",
    finalScore: "Итоговый Счёт",
    linesCleared: "Линий Очищено",
    playAgain: "Играть Снова",
    privacyPolicy: "Политика Конфиденциальности",
    builtWith: "Создано с",
  },
  ja: {
    play: "プレイ",
    leaderboard: "ランキング",
    missions: "ミッション",
    settings: "設定",
    back: "戻る",
    score: "スコア",
    level: "レベル",
    lines: "ライン",
    combo: "コンボ",
    time: "時間",
    moves: "手数",
    paused: "一時停止",
    gameOver: "ゲームオーバー",
    youWin: "勝利！",
    restart: "リスタート",
    menu: "メニュー",
    resume: "再開",
    selectMode: "モード選択",
    classic: "クラシック",
    timeAttack: "タイムアタック",
    endless: "エンドレス",
    challenge: "チャレンジ",
    puzzle: "パズル",
    insanity: "インサニティ",
    mirror: "ミラーモード",
    mirrorMode: "ミラーモード",
    gravityShift: "重力シフト",
    comboRush: "コンボラッシュ",
    theme: "テーマ",
    language: "言語",
    sound: "サウンド",
    audio: "オーディオ",
    music: "音楽",
    mute: "ミュート",
    unmute: "ミュート解除",
    rank: "ランク",
    player: "プレイヤー",
    date: "日付",
    noScores: "スコアなし。最初になろう！",
    submitScore: "スコア送信",
    enterName: "名前を入力",
    missionsTitle: "ミッション",
    progress: "進捗",
    completed: "完了",
    reward: "報酬",
    anyMode: "すべてのモード",
    mission1Desc: "クラシックモードで50ラインをクリア",
    mission2Desc: "いずれかのモードで10,000点を達成",
    mission3Desc: "タイムアタックで2分間生き残る",
    mission4Desc: "コンボラッシュで5倍コンボを達成",
    mission5Desc: "パズルのレベルを3つクリア",
    mission6Desc: "重力シフトモードで20ラインをクリア",
    mission7Desc: "ミラーモードで5,000点を達成",
    mission8Desc: "インサニティモードでレベル5まで生き残る",
    rewardRetroTheme: "レトロテーマ解放",
    rewardScoreMultiplier: "スコア倍率 x2",
    rewardSpaceTheme: "スペーステーマ解放",
    rewardComboRushBadge: "コンボラッシュバッジ",
    rewardOceanTheme: "オーシャンテーマ解放",
    rewardGravityBadge: "重力シフトバッジ",
    rewardMirrorBadge: "ミラーモードバッジ",
    rewardInsanityBadge: "インサニティバッジ",
    classicDesc:
      "オリジナルのテトリス体験。ラインを消してポイントを獲得しよう。",
    timeAttackDesc:
      "時間との戦い！制限時間内にできるだけ多くのラインを消そう。",
    endlessDesc: "ゲームオーバーなしで永遠にプレイ。リラックスして楽しもう。",
    challengeDesc: "障害を乗り越えろ！ランダムなゴミ行が現れてスキルを試す。",
    puzzleDesc: "パズルを解け！限られた手数で全ブロックを消そう。",
    insanityDesc: "極限の速度とランダムな向き。最強のみが生き残る！",
    mirrorDesc: "操作が逆転！左が右で右が左だ。",
    gravityShiftDesc: "重力が交互に変わる！ピースが上下交互に落ちる。",
    comboRushDesc: "コンボを連鎖して大きな倍率を獲得！ストリークを維持しよう。",
    diffEasy: "かんたん",
    diffMedium: "ふつう",
    diffHard: "むずかしい",
    diffExpert: "エキスパート",
    diffInsane: "狂気",
    finalScore: "最終スコア",
    linesCleared: "クリアライン",
    playAgain: "もう一度プレイ",
    privacyPolicy: "プライバシーポリシー",
    builtWith: "制作",
  },
  ko: {
    play: "플레이",
    leaderboard: "리더보드",
    missions: "미션",
    settings: "설정",
    back: "뒤로",
    score: "점수",
    level: "레벨",
    lines: "라인",
    combo: "콤보",
    time: "시간",
    moves: "이동",
    paused: "일시정지",
    gameOver: "게임 오버",
    youWin: "승리!",
    restart: "재시작",
    menu: "메뉴",
    resume: "계속",
    selectMode: "모드 선택",
    classic: "클래식",
    timeAttack: "타임 어택",
    endless: "무한",
    challenge: "챌린지",
    puzzle: "퍼즐",
    insanity: "인새니티",
    mirror: "미러 모드",
    mirrorMode: "미러 모드",
    gravityShift: "중력 변환",
    comboRush: "콤보 러시",
    theme: "테마",
    language: "언어",
    sound: "사운드",
    audio: "오디오",
    music: "음악",
    mute: "음소거",
    unmute: "음소거 해제",
    rank: "순위",
    player: "플레이어",
    date: "날짜",
    noScores: "점수 없음. 첫 번째가 되세요!",
    submitScore: "점수 제출",
    enterName: "이름을 입력하세요",
    missionsTitle: "미션",
    progress: "진행",
    completed: "완료",
    reward: "보상",
    anyMode: "모든 모드",
    mission1Desc: "클래식 모드에서 50라인 제거",
    mission2Desc: "어느 모드에서든 10,000점 달성",
    mission3Desc: "타임 어택에서 2분 생존",
    mission4Desc: "콤보 러시에서 5배 콤보 달성",
    mission5Desc: "퍼즐 레벨 3개 완료",
    mission6Desc: "중력 변환 모드에서 20라인 제거",
    mission7Desc: "미러 모드에서 5,000점 달성",
    mission8Desc: "인새니티 모드에서 레벨 5까지 생존",
    rewardRetroTheme: "레트로 테마 해금",
    rewardScoreMultiplier: "점수 배율 x2",
    rewardSpaceTheme: "우주 테마 해금",
    rewardComboRushBadge: "콤보 러시 뱃지",
    rewardOceanTheme: "오션 테마 해금",
    rewardGravityBadge: "중력 변환 뱃지",
    rewardMirrorBadge: "미러 모드 뱃지",
    rewardInsanityBadge: "인새니티 뱃지",
    classicDesc: "오리지널 테트리스 경험. 라인을 클리어해서 점수를 얻으세요.",
    timeAttackDesc:
      "시계와의 경쟁! 시간이 끝나기 전에 최대한 많은 라인을 클리어하세요.",
    endlessDesc: "게임 오버 없이 영원히 플레이. 편하게 즐기세요.",
    challengeDesc: "장애물을 극복하세요! 랜덤 쓰레기 행이 나타납니다.",
    puzzleDesc: "퍼즐을 풀어라! 제한된 이동으로 모든 블록을 지우세요.",
    insanityDesc: "극한 속도와 무작위 방향. 최강만이 살아남는다!",
    mirrorDesc: "조작이 반전됩니다! 왼쪽이 오른쪽이고 오른쪽이 왼쪽입니다.",
    gravityShiftDesc:
      "중력이 교대로 바뀝니다! 블록이 위아래 교대로 떨어집니다.",
    comboRushDesc: "콤보를 연결해 엄청난 배율을 획득하세요! 연속을 유지하세요.",
    diffEasy: "쉬움",
    diffMedium: "보통",
    diffHard: "어려움",
    diffExpert: "전문가",
    diffInsane: "광기",
    finalScore: "최종 점수",
    linesCleared: "클리어 라인",
    playAgain: "다시 플레이",
    privacyPolicy: "개인정보 처리방침",
    builtWith: "제작",
  },
  tr: {
    play: "Oyna",
    leaderboard: "Liderlik Tablosu",
    missions: "Görevler",
    settings: "Ayarlar",
    back: "Geri",
    score: "Puan",
    level: "Seviye",
    lines: "Satır",
    combo: "Kombo",
    time: "Süre",
    moves: "Hamle",
    paused: "Duraklat",
    gameOver: "Oyun Bitti",
    youWin: "Kazandın!",
    restart: "Yeniden Başlat",
    menu: "Menü",
    resume: "Devam Et",
    selectMode: "Mod Seç",
    classic: "Klasik",
    timeAttack: "Zaman Saldırısı",
    endless: "Sonsuz",
    challenge: "Meydan Okuma",
    puzzle: "Bulmaca",
    insanity: "Çılgınlık",
    mirror: "Ayna Modu",
    mirrorMode: "Ayna Modu",
    gravityShift: "Yerçekimi Değişimi",
    comboRush: "Kombo Koşusu",
    theme: "Tema",
    language: "Dil",
    sound: "Ses",
    audio: "Ses",
    music: "Müzik",
    mute: "Sessiz",
    unmute: "Sesi Aç",
    rank: "Sıra",
    player: "Oyuncu",
    date: "Tarih",
    noScores: "Henüz puan yok. İlk sen ol!",
    submitScore: "Puan Gönder",
    enterName: "Adını gir",
    missionsTitle: "Görevler",
    progress: "İlerleme",
    completed: "Tamamlandı",
    reward: "Ödül",
    anyMode: "Herhangi Bir Mod",
    mission1Desc: "Klasik modda 50 satır temizle",
    mission2Desc: "Herhangi bir modda 10.000 puana ulaş",
    mission3Desc: "Zaman Saldırısı'nda 2 dakika hayatta kal",
    mission4Desc: "Kombo Koşusu'nda 5x kombo yap",
    mission5Desc: "3 Bulmaca seviyesini tamamla",
    mission6Desc: "Yerçekimi Değişimi modunda 20 satır temizle",
    mission7Desc: "Ayna Modu'nda 5.000 puan kazan",
    mission8Desc: "Çılgınlık modunda 5. seviyeye kadar hayatta kal",
    rewardRetroTheme: "Retro Tema Kilidi Aç",
    rewardScoreMultiplier: "Puan Çarpanı x2",
    rewardSpaceTheme: "Uzay Teması Kilidi Aç",
    rewardComboRushBadge: "Kombo Koşusu Rozeti",
    rewardOceanTheme: "Okyanus Teması Kilidi Aç",
    rewardGravityBadge: "Yerçekimi Değişimi Rozeti",
    rewardMirrorBadge: "Ayna Modu Rozeti",
    rewardInsanityBadge: "Çılgınlık Rozeti",
    classicDesc:
      "Orijinal Tetris deneyimi. Satırları temizleyerek puan kazan ve seviye atla.",
    timeAttackDesc:
      "Zamana karşı yarış! Süre dolmadan olabildiğince çok satır temizle.",
    endlessDesc: "Oyun bitmeden sonsuza kadar oyna. Rahatlayıp keyfini çıkar.",
    challengeDesc:
      "Engelleri aş! Becerini test etmek için rastgele çöp satırlar çıkar.",
    puzzleDesc: "Bulmacayı çöz! Sınırlı hamleyle tüm blokları temizle.",
    insanityDesc:
      "Aşırı hız ve rastgele parça yönleri. Sadece en iyiler hayatta kalır!",
    mirrorDesc: "Kontroller ters! Sol sağdır, sağ soldur.",
    gravityShiftDesc:
      "Yerçekimi yön değiştirir! Parçalar sırayla yukarı ve aşağı düşer.",
    comboRushDesc:
      "Komboları zincirle ve büyük çarpanlar kazan! Seriyi canlı tut.",
    diffEasy: "Kolay",
    diffMedium: "Orta",
    diffHard: "Zor",
    diffExpert: "Uzman",
    diffInsane: "Çılgın",
    finalScore: "Son Puan",
    linesCleared: "Temizlenen Satırlar",
    playAgain: "Tekrar Oyna",
    privacyPolicy: "Gizlilik Politikası",
    builtWith: "ile yapıldı",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  allLanguages: Language[];
}

const ALL_LANGUAGES: Language[] = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "ja",
  "ko",
  "tr",
];

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: TRANSLATIONS.en,
  allLanguages: ALL_LANGUAGES,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("tetrisverse-language") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tetrisverse-language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
        allLanguages: ALL_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
