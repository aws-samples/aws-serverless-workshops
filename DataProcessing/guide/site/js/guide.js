$(window).on('load', function() {
   // Hide content from long blockquotes in scrolling div
  const details = $('details');

  details.attr('open', true);

  $.find('pre').forEach(function(el) {
    const pre = $(el);

    if (pre.height() > 350) {
      pre.addClass('scrolling');
    }
  });

  details.attr('open', false);
  // "Copy to Clipboard" buttons
  $('button.copy').on('click', function(e) {
    const button = $(e.target)
    const textArea = $('textarea#buffer');
    const previousButtonText = button.text();
    const content = button.prev().text();

    textArea.show().val(content).select();
    document.execCommand('copy', false);
    textArea.hide().val('');

    setTimeout(() => button.text(previousButtonText), 3000);
    button.text('Copied!');
  });

  // Set external links to open in new tab
  $('a[href^="http"').each((_, link) => link.target = 'blank');
});
