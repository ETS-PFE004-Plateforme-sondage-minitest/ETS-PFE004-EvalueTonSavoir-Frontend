var converter;

function giftPreviewHTML(qArray, theDiv, showAnswers=true) {
    var html = "";
    var q;
    //console.log(qArray);
    for (var i=0; i<qArray.length; i++) {
        // console.log("i = " + i + " and qArray[i] is '" + qArray[i] );
        q = qArray[i];
        html += '<div id="question_' + i + '">';
        // console.log("q.type is '" + q.type );
        switch (q.type) {
            case "Description":
                html += makeTitle("Description", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                theDiv.innerHTML+=html; html = "";
                break;
            case "MC":
                html += makeTitle("Multiple choice", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices, showAnswers);
                html += formatFeedback(q.globalFeedback) + "</div>";
                theDiv.innerHTML+=html; html = "";
                break;
            case "Short":
                html += makeTitle("Short answer", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatAnswers(q.choices, showAnswers);
                html += formatFeedback(q.globalFeedback) + "</div>";
                theDiv.innerHTML+=html; html = "";
                break;
            case "Essay":
                html += makeTitle("Essay", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback) + "</div>";
                theDiv.innerHTML+=html; html = "";
                break;
           case "TF":
                html += makeTitle("True/False", q.title);
                html +=(showAnswers ? "<p><em>(" + (q.isTrue ? "True" : "False") + ")</em> " : "<p>") + applyFormat(q.stem) + "</p>";
                html += formatFeedback(q.globalFeedback) + "</div>";
                theDiv.innerHTML+=html; html = "";
                break;
            // case "Matching":
            //     html += makeTitle("Matching", q.title);
            //     html +="<p>" + applyFormat(q.stem) + "</p>";
            //     formatMatchingAnswers(q, theDiv, i, html);
            //     html = formatFeedback(q.globalFeedback) + "</div>";
            //     theDiv.innerHTML+=html; html = "";
            //     break;
            case "Numerical":
                html += makeTitle("Numerical", q.title);
                html +="<p>" + applyFormat(q.stem) + "</p>";
                html += formatNumericalAnswers(q.choices);
                html += formatFeedback(q.globalFeedback) + "</div>";
                theDiv.innerHTML+=html; html = "";
                break;
            // for case "Matching": see https://stackoverflow.com/a/35493737/1168342
            default:
                break;
        }
    }
}

function makeTitle(type, title) {
    return "<b>" + type + (title !== null ? ' "' + title + '"' : "" ) + "</b>";
}

function formatAnswers(choices, showAnswers=true) {
    var html = '<ul class="mc">';
    shuffle(choices);

    for (var a=0; a<choices.length; a++) {
        var answer = choices[a];
        html += '<li class="' +
          (showAnswers ? ((answer.isCorrect || answer.weight > 0) ? 'rightAnswer' : 'wrongAnswer') : '') +
          '">' + (answer.weight !== null ? "<em>(" + answer.weight + "%)</em> " : '') +
          applyFormat(answer.text) + 
          (answer.feedback !== null ? " [" + applyFormat(answer.feedback) + "]" : '') +
          "</li>";
    }
    html += "</ul>";
    return html;
}

function formatNumericalAnswers(choices) {
    var html = "";
    switch (choices.type) {
        case "range":
            var answer = choices.number;
            var tolerance = choices.range;
            html += '<p class="rightAnswer">' + answer + " environ " + tolerance + "%</p>";
            break;
        case "high-low":
            var high = choices.numberHigh;
            var low = choices.numberLow;
            html += "Entre " + low + " et " + high;
            break;
        default:
            break;
    }
    return html;
}

// function formatMatchingAnswers(q, theDiv, qNum, html) {
//     var rightSideChoices = new Set();
//     var htmlLines = '';
//     for (var i=0; i<q.matchPairs.length; i++) {
//         htmlLines += '<path id="line' + i + '" stroke="rgba(180,180,255,0.5)" stroke-width="5" fill="none"/>';
//     }
//     html += '<svg class="theSVG" style="position: absolute; z-index: -1;" width="100%" height="100%" z-index="-1"><g>' + htmlLines + '</g></svg>';

//     html +='<div class="row"><div class="col-md-6">';  // left side
//     for (var i=0; i<q.matchPairs.length; i++) {
//         var pair = q.matchPairs[i];
//         html += '<div id="left' + i + '" style="background:#ddddff">';
//         html += '<p>' + applyFormat(pair.subquestion) + '</p>';
//         html += '</div>';
//         rightSideChoices.add(pair.subanswer);
//     }
//     //console.log('Found rightSideChoices: ' + rightSideChoices.size);
//     html += '</div>'

//     html += '<div class="col-md-6">'; // right side
//     var rightSideArray = Array.from(rightSideChoices);
//     shuffle(rightSideArray);
//     for (var it = rightSideArray.values(), val= null; val=it.next().value;) {
//         html += '<div id="right_' + val.replace(/\s/g, '_') + '" style="background:#ddddff">';
//         html += '<p>' + val + '</p>';
//         html += '</div>';
//     }
//     html += '</div></div>'
//     // make the SVG for lines, see https://stackoverflow.com/a/35493737/1168342
//     theDiv.append(html); html = "";  // force the HTML into the DOM

//     // set the lines up - search only inside this question's div (theDiv) 
//     for (var i=0; i<q.matchPairs.length; i++) {
//         var qDiv = document.getElementById("question_" + qNum);
//         var pair = q.matchPairs[i];
//         var line = qDiv.find("#line" + i); //console.log("line" + i + ": " + line);
//         var leftDiv = qDiv.find("#left" + i);  //console.log("leftDiv: " + leftDiv);
//         var subAnswerID = "right_" + encodeURIComponent(pair.subanswer.replace(/\s/g, '_'));
//         var rightDiv = qDiv.find('#' + subAnswerID); 
//         var pos1 = leftDiv.offset();
//         var pos2 = rightDiv.offset();
//         var svg = qDiv.find(".theSVG").offset();
//         var x1 = pos1.left - svg.left + leftDiv.width();
//         var y1 = pos1.top + leftDiv.height()/2 - svg.top;
//         var x2 = pos2.left - svg.left;
//         var y2 = pos2.top + rightDiv.height()/2 - svg.top;
//         var inset = 10;
//         line.attr('d', "M" + x1 + "," + y1 + " C" + (x1 + inset) + "," + y1 + " " + (x2 - inset) + ',' + y2 + " " + x2 + "," + y2);
//         qDiv.find(".theSVG").attr('height', pos1.top + leftDiv.height() - svg.top);
//     }
// }

function applyFormat(giftText) {
    var html = "";
    var unescapedString;
    switch (giftText.format) {
        case "html":
        case "moodle":
            // convert Moodle's embedded line feeds (GIFT) to HTML
            unescapedString = giftText.text.replace(/\\n/g, '<br>');
            html = unescapedString;
            break;
        case "plain":
            html = giftText.text;
            break;

        case "markdown":
            // convert Moodle's embedded line feeds (GIFT) in markdown
            unescapedString = giftText.text.replace(/\\n/g, '\n');
            html = converter.makeHtml(unescapedString);
            break;

        default:
            break;
    }
    if (html === "") html="&nbsp;";  // special case so div's aren't empty
    return html;
}

function formatFeedback(feedback) {
    return feedback !== null ? 
            '<p style="margin-left: 40px"><em>General feedback:</em> ' + 
            applyFormat(feedback) + '</p>' : '';
}

// https://stackoverflow.com/a/2450976/1168342
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

export default giftPreviewHTML;