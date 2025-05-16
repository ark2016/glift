/**
 * Скрипт для управления Go-доской и обработки SGF
 */
document.addEventListener('DOMContentLoaded', function() {
  let currentGliftInstance = null;
  
  /**
   * Инициализация Glift с выбранным SGF
   * @param {string} sgfContent - содержимое SGF файла
   */
  function initGlift(sgfContent) {
    if (currentGliftInstance) {
      // Если экземпляр Glift уже существует, удаляем его
      currentGliftInstance.destroy();
    }
    
    // Извлекаем информацию об игроках
    const playerBlackMatch = sgfContent.match(/PB\[([^\]]+)\]/);
    const playerWhiteMatch = sgfContent.match(/PW\[([^\]]+)\]/);
    
    const playerBlackName = playerBlackMatch ? playerBlackMatch[1] : "Черные";
    const playerWhiteName = playerWhiteMatch ? playerWhiteMatch[1] : "Белые";
    
    document.getElementById('player-black').textContent = "Черные: " + playerBlackName;
    document.getElementById('player-white').textContent = "Белые: " + playerWhiteName;

    // Извлекаем информацию о времени
    const timeBlackMatch = sgfContent.match(/BL\[([\d.]+)\]/);
    const timeWhiteMatch = sgfContent.match(/WL\[([\d.]+)\]/);

    const timeBlack = timeBlackMatch ? timeBlackMatch[1] + " сек." : "-";
    const timeWhite = timeWhiteMatch ? timeWhiteMatch[1] + " сек." : "-";

    document.getElementById('time-black').textContent = "Черные: " + timeBlack;
    document.getElementById('time-white').textContent = "Белые: " + timeWhite;
    
    // Создаем новый экземпляр Glift
    currentGliftInstance = glift.create({
      divId: "glift-container",
      sgf: sgfContent,
      display: {
        theme: "COLORFUL",
        goBoardBackground: "#f2b06d"
      },
      allowWrapAround: true,
      useMarkdown: true
    });
  }
  
  // Обработчик изменения выбора SGF
  document.getElementById('sgf-select').addEventListener('change', function(e) {
    const selectedSgf = e.target.value;
    
    if (SGF_EXAMPLES[selectedSgf]) {
      initGlift(SGF_EXAMPLES[selectedSgf]);
    }
  });
  
  // Кнопки навигации
  document.getElementById('prev-button').addEventListener('click', function() {
    if (currentGliftInstance) {
      currentGliftInstance.applyBoardAction('back');
    }
  });
  
  document.getElementById('next-button').addEventListener('click', function() {
    if (currentGliftInstance) {
      currentGliftInstance.applyBoardAction('forward');
    }
  });
  
  // Инициализируем с первым SGF
  initGlift(SGF_EXAMPLES["simple.sgf"]);
}); 