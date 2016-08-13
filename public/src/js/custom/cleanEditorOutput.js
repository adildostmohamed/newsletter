var cleanOutput = (function($){
  return {
    cleanParagraphs: function() {
      $('p').each(function() {
        var $this = $(this);
        if($this.html().replace(/\s|&nbsp;/g, '').length === 0) {
          $this.remove();
        }
    });
    }
  };
})(jQuery);

cleanOutput.cleanParagraphs();
