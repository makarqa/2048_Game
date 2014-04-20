<?php
$game_box = "";
for ($i = 1; $i <= 16; $i++) {
    $game_box .= "<div class='box' id=$i></div>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <link href="css/game_css.css" rel="stylesheet" type="text/css">

    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="js/game_js.js"></script>
    <title></title>
</head>
<body>


<div class="buttons">
    <div id="divup"><img src="img/up.png" id="up" class="arrow"></div>
    <div id="divleft"><img src="img/left.png" id="left" class="arrow"></div>
    <div id="divright"><img src="img/right.png" id="right" class="arrow"></div>
    <div id="divdown"><img src="img/down.png" id="down" class="arrow"></div>
</div>


<div id="right_panel">
    <div id="show_score">
        <p id="score_name">Score: </p>
        <p id="score"></p>
    </div>
    <input type="button" id="save_pole" value="Save game">
</div>

<div id="game">
    <?php echo $game_box ?>
</div>

</body>
</html>