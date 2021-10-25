# Super-Bug-Zapper
Project 2 Assignment for COSC 414 


1. The playing field starts as surface of a spherecentered at the origin. <br>
2. The player can dragthe sphereto rotate to look for bacteria(under interactive control).<br>
3. Bacteria grow on the surfaceof the spherestarting at an arbitrary spot on the surfaceand growing out uniformly in alldirectionsfrom that spot at a speed determined by the game.<br>
4. The player needs to eradicate the bacteria by placing the mouse over the bacteria and hitting a button.<br>
5. The effect of the poison administered is to immediately remove the poisoned bacteria.<br>
6. The game can randomly generate up to a fixed number (say 10) of different bacteria (eachwitha different color).<br>
7. The bacteria appear as a colored circular patchon the surfaceof the sphere.<br>
8. The game gains points through the delays in the user responding and by any specific bacteria reaching a threshold (for example,a diameter of a 30-degree arcon a great circle of the sphere).<br>
9. The player wins if all bacteria are poisoned before any twodifferent bacteria reach the threshold mentioned above.<br><br>


A well-developed implementation for the above will earn a grade of 80%. To get higher grade, two of the following should be completed in addition (each feature successfully completed adds 10%).<br><br>

1. The effect of the poison administered also propagates outward from the point of insertion of the position until all the bacteria are destroyed.<br>
2. When two bacteria cultures collide, the first one to appear on the surfacedominates and consumes the later generated bacteria.<br>
3. When a bacterial culture is hit, use a simple 2D particle system to simulate an explosion at the point where the poison is administered.<br>
4. Lighting is used. Use GUI control to enable or disable lighting.<br>
