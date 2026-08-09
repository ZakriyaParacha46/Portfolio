# Scraped content from the old site (sites.google.com/view/zakriyaparacha)

Pulled directly from the live Google Sites pages. Used as the source of truth for the courses page and project detail pages. Text is quoted from the original site; image URLs are the original Google-hosted URLs (blocked for direct download from this environment, see assets/projects/IMAGES_TO_DOWNLOAD.md).

## Achievements (from Formal Education page)

- Merit Certificate for distinguished student for five consecutive SGPAs above 3.5, 2023
- Final Year Project placed in the top 5 groups, 2024
- Merit Certificate for distinguished student for an SGPA of 4, 2023
- Merit Certificate for distinguished student for an SGPA above 3.5, 2024
- Three-time merit-based scholarship winner for being in the top 5 students
- Second position at the Entrepreneurship Idea Competition "TECHNOVATION," 2024

Favourite courses from the degree: Digital System Design, Microprocessors and Microcomputers, Logic and Sequential Circuits, Computer System Architecture, Digital Image Processing.

## Self Learning page (courses.html source)

### Specializations

**Development of Secure Embedded Systems** (EIT Digital)
Verify: https://coursera.org/share/e334a02551accb132c623da8f84733ae
> In the "Development of Secure Embedded Systems" specialization, I focused on creating robust embedded solutions, starting with the fundamentals of embedded hardware and operating systems. I then explored web connectivity and security measures essential for protecting embedded systems from vulnerabilities. My studies included the development of real-time systems to ensure timely and reliable responses in critical applications. In the capstone project, I applied these principles to create an autonomous runway detection system for IoT, demonstrating my ability to integrate security and functionality in embedded systems. This specialization honed my problem-solving skills and prepared me for advanced tasks in both academic and industrial settings.

**An Introduction to Programming the Internet of Things (IoT)** (University of California, Irvine)
Verify: https://www.coursera.org/account/accomplishments/specialization/certificate/56SV4EUEVFC7
> In my IoT specialization, I delved into the fundamentals of the Internet of Things and embedded systems. I explored the Arduino platform, mastering C programming and interfacing techniques to build responsive hardware projects. I also studied the Raspberry Pi, learning Python to create versatile applications and interact with various sensors and actuators. The capstone project allowed me to integrate these skills, resulting in the design and deployment of a unique IoT device. This practical experience involved programming microcontrollers and connecting them to control and monitor the physical world, equipping me with the expertise to develop innovative IoT solutions.

**Hands-on Internet of Things** (University of Illinois)
Verify: https://www.coursera.org/account/accomplishments/specialization/certificate/74LFLSCNDQCQ
> The Hands-on Internet of Things specialization spans four courses, providing a thorough exploration of IoT technology. Beginning with IoT Devices, learners gain familiarity with foundational concepts and practical experience through a project simulating a vehicular network. Advancing to IoT Communications, participants delve into RF communication, mesh networking, and distributed algorithms to enhance device connectivity. In IoT Networking, the focus shifts to enterprise IoT, addressing challenges in network infrastructure and protocols crucial for device connectivity to the internet. Finally, in IoT Cloud, learners explore decentralized network topography and essential cloud technologies with an emphasis on security infrastructure. Through a combination of theoretical learning and hands-on projects, this specialization equips participants with the skills necessary to navigate and contribute effectively to the dynamic realm of IoT.

**Google Cybersecurity** (Google)
Verify: https://coursera.org/share/5fa69f5a12af5692b09764d9c912e81b
> The Google Security specialization covers a comprehensive range of topics essential for understanding and implementing cybersecurity measures effectively. It begins by exploring incident detection and response, detailing the lifecycle of incidents and the tools necessary for documentation and management. It then delves into foundational aspects of cybersecurity, preparing learners for security careers by defining the field, outlining job responsibilities, and emphasizing core skills. The specialization further advances with practical automation techniques using Python for cybersecurity tasks and delves into understanding assets, threats, and vulnerabilities, alongside risk mitigation strategies using frameworks like NIST. Additionally, it provides insights into operating systems like Linux and SQL, network fundamentals, and managing security risks, including CISSP domains and risk management procedures. The program concludes by guiding learners on preparing for cybersecurity job roles, rounding off a comprehensive education in Google Security.

**Python for Everybody** (University of Michigan)
Verify: https://www.coursera.org/account/accomplishments/specialization/certificate/FRDXNGK5LQ8P
> As part of the University of Michigan's Python Specialization on Coursera, I had the opportunity to work on a hands-on project that involved taking a location as input, utilizing APIs to retrieve its coordinates, storing this data in a SQL database, and ultimately presenting it on a Flask API-powered map. This practical project not only reinforced my Python programming skills but also showcased my ability to seamlessly integrate different technologies to create a valuable and interactive mapping solution. I learned skills like Data structures, Web scraping / Web Crawler (urllib, sockets, Beautiful soup), Restful API, Relational Databases (sqlite3) and Data visualizations.

### Courses (no verify link given on the old site)

**Introduction to Embedded Machine Learning and Computer Vision with Embedded Machine Learning** (Edge Impulse)
> This course, offered by Edge Impulse on Coursera, was a valuable and comprehensive introduction to the exciting fields of embedded machine learning and computer vision. Led by instructor Shawn Hymel, it covered essential topics such as feature extraction, model training, model evaluation, and anomaly detection, along with the practical aspects of deploying machine learning models on embedded systems. The exploration of Convolutional Neural Networks for image classification, plus concepts like data augmentation and transfer learning, gave a well-rounded understanding of computer vision techniques, and the introduction to object localization, detection, and segmentation made it a great foundation for anyone starting out in these fields.

**Build a Modern Computer from First Principles: From Nand to Tetris** (Hebrew University of Jerusalem)
> Finishing this course, led by Professors Shimon Schocken and Noam Nisan, was a transformative experience. It covered the entire spectrum of computer science, starting with the fundamentals of Boolean Logic and Sequential Logic, progressing through Small Scale Integration, Computer Architecture, Assemblers, Virtual Machines, Compilers, Operating Systems, and Applications. What made it exceptional was the hands-on nature of the course, actually designing and constructing these components. It gave me a profound understanding of how computers work.

## Experience page extras

Freelance favourite projects (Fiverr):
- C++ virus simulation with different parameters and rules
- Python naive genetic algorithm to learn to play Connect 4
- Python and C++ simulators/compilers like FISC, ABM
- MIPS parse tree to solve mathematical expressions
- C ciphering/deciphering tool implementing XOR cipher, cyclic block cipher, and electronic codebook cipher

## Project detail write-ups

### Arduino 2D Printer
GitHub: https://github.com/ZakriyaParacha46/2D-printer

**Introduction:** A 2D printer powered by an Arduino UNO, inspired by 2D CNC machines. Two NEMA17 stepper motors handle each axis, plus a servo motor to plot dots. The motors draw around 1.2A at 12V while printing. Internally, the Uno holds a 32x32 boolean array, plotted one dot at a time; a full image takes 2 to 4 minutes worst case, after which the Python side prepares the next image.

**Image processing:** Uses the PIL Image module. The source image is opened, converted to black and white, and resized to 32x32 pixels. The result is plotted with matplotlib, then sent to the Arduino serial port byte by byte.

**Printing mechanism:** A platform sits on the base. A stepper motor mounted on the platform controls y-axis movement through a coupling connector linking the motor shaft to a threaded rod; a base mounted on the rod moves as the motor turns. A matching assembly controls x-axis movement of the servo motor, which drops the pen to draw and lifts it to move. Stepper motors run off a 12V supply and are driven by pulses from the Arduino; the servo is also Arduino-controlled. The Python program converts a .bmp image into a 32x32 pixel bit array and sends it over serial. A green LED lights when the Arduino is ready to read; a red LED stays on while printing. The Arduino reads the array, rebuilds it as a 2D array, and iterates through it in a nested loop, dropping the pen on a 1 and lifting it on a 0. Once done, the stepper motors return to the origin point.

**Algorithm:** A scanning algorithm following a snake pattern plots every point, giving the best time efficiency without further optimization.

**Specifications:** Images of 8x8cm have been printed within 2 to 4 minutes. Pixel density is 35 steps per pixel, roughly 1mm.

**Structure:** Built from wood. A 22x20cm board forms the base. 20x4.5cm and 22x5cm pieces form the motor assembly bases. 4.5x5cm and 4.5x4.5cm pieces form the walls, with holes for the threaded rods. Another 4.5x5cm piece serves as the platform for the second motor, supported by wooden skewers glued to the walls.

**Conclusions:** A fun project that gave real insight into mechanics, mathematics, and motors, and hands-on experience with Arduino serial communication, including casting data points from bools to bytes and back for storage in the Arduino's array.

References: [stepper motor basics](https://www.youtube.com/watch?v=0qwrnUeSpYQ), [worked example](https://www.youtube.com/watch?v=S8YVlR_1hlo)

### Braille Language Translator
GitHub: https://github.com/ZakriyaParacha46/Image-Processing

**Introduction:** Braille is a system of raised dots read by touch. Converting a photographed page of Braille into text by hand is slow and error-prone. This project automates it using a pipeline of Gaussian blur, thresholding, erosion, and connected component analysis (CCA) to detect individual Braille characters, then a clustering step converts each character into a 6-character string representing one Braille unit, matched against a lookup table.

**Preprocessing:**
- Apply Gaussian blur to remove imperfections and stray pixels from the input image
- Convert the 8-bit grayscale image to binary to improve connectivity analysis
- Erode the image to shrink the white regions, causing black dots to spread and join into characters

**Methodology:**
- Apply the CCA8 function to the eroded image to get the character count, per-object statistics, and a labeled object map
- Convert each object into a 6-character string, where each character represents one Braille dot
- Run post-processing (key creation and enhancement) to keep the translation accurate
- Output the converted text

**Post-processing:**
- Use the object statistics to measure the distance between consecutive objects, marking a gap as a space if the distance passes a threshold
- Draw a bounding box around each object from its length, width, and starting point so one character is processed at a time
- Apply the clustering step to each character: treat it as a vertical rectangle, crop it into a 3x2 grid, and check each cell to decide if it is a raised dot or blank

**Translation:** The conversion table is a JSON file mapping Braille characters to English letters. Each key is a 6-digit binary string representing a 3x2 Braille dot pattern (first three digits: left column, last three digits: right column), each value the corresponding lowercase letter. A `translate` function looks up each character from the `chars` array in this table to build the output text.

**Output:** Successfully converted a 640-character Braille passage back to its original English text (a paragraph about current affairs, including topics like the COVID-19 pandemic and climate change). The conversion key itself was generated using the same processing pipeline.

### Image Classification Using Feature Extraction
GitHub: https://github.com/ZakriyaParacha46/Image-Processing | Colab: https://colab.research.google.com/drive/1JLdkbFz6NLO5h2hb9o4e8rUrNQLkFE5H?usp=sharing

**Introduction:** Built around the PH2 dermoscopic image dataset (created to support comparative research on skin lesion segmentation and classification), motivated by the rising occurrence of melanoma and the need for computer-aided diagnosis. The dataset holds 200 images across 3 classes: 80 common nevi, 80 atypical nevi, and 40 melanomas, each with a lesion mask.

**Working:** A Python script classifies lesions into the three classes by extracting handcrafted features (color values, symmetry, irregularity, average phase) rather than training a neural network. It reads the dataset, processes each image, extracts features, and computes per-class averages, visualizing the class differences in 3D scatter plots, then prints the differences between class averages.

**Steps:**
- Get file details: read `PH2_dataset.txt` to build a dictionary of `{class: [files in that class]}`
- Choose the parameters: started from a large set of candidate parameters, judged each by classification quality, and kept only the useful ones
- Calculate average class parameters: a nested loop applies the feature functions to every image and averages the results per class (the split between Atypical and Common nevi turned out weak)
- Classification: settled on 16 parameters for the final code (others produced errors), using a voting mechanism rather than distance-based classification, so each parameter's contribution could be checked individually

**Feature functions:**
- *Symmetry:* splits the image along its vertical and horizontal center lines, mirrors one half onto the other, and XORs them; the resulting white pixel count captures the asymmetry and curvature of the mole
- *Colors:* splits the image into BGR channels and computes the histogram average, mode, and standard deviation for each
- *Irregularity and phase:* irregularity applies a threshold and counts white pixels to capture the overall gray distribution; phase applies horizontal and vertical Sobel operators and returns the magnitude and average phase of the image

**Output:** Accuracy ranged 58 to 75% depending on the train/test split, since the result is sensitive to the chosen parameters. Final accuracy across the whole dataset was 63.3%.

Acknowledgement: assigned as coursework by [Dr Usman Akram](https://www.linkedin.com/in/usmakram/).

### C++ Audio Player
GitHub: https://github.com/ZakriyaParacha46/Audio-Player

**Introduction:** A GUI audio player that simulates a car stereo, playing from a CD or USB. Supports building playlists, shuffling, saving/loading a playlist to a text file, adding or deleting songs, and searching by name. Mounting a device starts playback; the UI shows the current song name alongside pause/play, next/previous, and power controls. Accepts .mp3 and .wav files.

**How it works:** On start, a device is mounted through the `navigation` and `storage_media` classes, which read the file names at the user-given path. A CD only accepts .mp3 files; a USB is capped at 16GB. The `aud_player` and `aud_playerv2` classes handle playback: a playlist view lists every song and supports shuffle, search, add, and delete. Selecting a song enables pause, stop, and resume. The playlist is saved to a text file so it can be reloaded on the next run.

Concepts used: abstraction, dynamic arrays, composition, file handling, GUI programming (WinForms).

Features: file handling and playlist persistence, file and folder browsing to add songs, searching by name, play/pause/resume/stop, and error and status handling for the current song and device.

Acknowledgement: built with contributions from [Aazain Umarani](https://www.linkedin.com/in/aazain-umrani-494578241/).

### Heuristic Approach to Minimizing Boolean Functions Using Binary Trees
GitHub: https://github.com/ZakriyaParacha46/Minimization-of-boolean-Expression-using-Binary-Tree-

**Abstract:** Simplifying Boolean functions before implementation gives cheaper, faster hardware, but almost no algorithm handles functions of more than 6 variables well. This project's heuristic method builds a Boolean binary tree, overfits it to the minterm data, and reads the tree back out as a simplified Boolean function.

**Introduction:** Design complexity scales with the number of terms and literals in a Boolean function. Using a Boolean binary tree, expressions with more than 15 variables can be handled even in the worst case for minterms. The approach draws loose inspiration from the Shannon-Fano lossless compression method.

**Related work:** The model is a form of decision tree, a machine learning concept that splits input data on a chosen parameter until reaching an outcome. Two classical points of comparison: the Espresso algorithm, which minimizes two-level logic by manipulating cubes representing minterms, and the Quine-McCluskey algorithm, which finds all prime implicants of a function and then the essential ones.

**Definitions:** A Boolean binary tree is a data structure where each node splits its children on one bit. Every node checks one bit and returns the literal X or !X depending on the result; once a leaf is reached, the tree unwinds back up.

**Algorithm:** A greedy approach. Minterms are converted to binary, then the entropy of each variable is calculated to find the best splitting point, entropy here meaning how often a variable switches between 0 and 1 across the minterms. The variable with the lowest entropy separates the most minterms and becomes the next node. For example, in the minterms sigma(1,3,5,7), C has the lowest entropy, so splitting on C produces a single true node and the tree does not grow wider. The chosen variable is set aside, and the same process recurses on the rest. At a leaf, the literal is returned, negated if reached through the false branch.

**Leaf conditions:**
- A single remaining minterm converts directly to its literal form
- If the left and right groups are equal in size after picking the minimum-entropy variable, that node is treated as a leaf and the tree stops growing
- The tree caches minterm and solution pairs, so a repeated set of minterms returns the cached solution instead of recomputing
- (Not implemented) a sequence classification model to predict upfront whether a set of minterms can be grouped, which would cut complexity further even if occasionally wrong, since the fallback solution stays correct

**Intuition:** Boolean minimization can be pictured as a hypercube lattice (a 3D lattice for 3 variables, extendable to higher dimensions). A random-forest-style extension, running multiple binary trees with different cut choices, could give multiple perspectives on the same minterms, from which the essential implicants can be picked out of the full implicant list.

**Complexity:** The problem is NP-hard. Even with 6 variables there are roughly 1.84x10^19 possible functions. The algorithm runs in O(2^n) time where n is the number of minterms (not variables), and O(n) space, though safety nets keep the typical solve time well below the worst case. With respect to variable count the complexity is O(n): each new variable adds one more pass.

**Performance evaluation:** Measured by increasing the variable count and doubling the minterm count, using 50 random minterm sets per variable count drawn from a uniform distribution via numpy.

**Discussion:** The algorithm handles any variable count a modern computer can process. In the worst case, where minterms cannot be grouped at all, complexity is 2^n, but the algorithm checks for that worst case upfront and returns the input directly rather than letting the problem scale exponentially.

**Limitations:** Quine-McCluskey remains more accurate, since it guarantees the minimum number of terms needed to stay logically equivalent to the input.

**Conclusions and future work:** For large variable counts Quine-McCluskey is fast, but the Boolean tree keeps pace while trading perfect minimization for speed via the heuristic. Ideas borrowed from random forests and sequence classification could tighten the accuracy further.

References:
- Kernighan, B. W. and Lin, S. "An efficient heuristic procedure for partitioning graphs." The Bell System Technical Journal, 1970, pages 291-307.
- Oliveira, Arlindo L. "Inductive Learning by Selection of Minimal Representations." PhD thesis, UC Berkeley, 1994.
- Quinlan, J. R. "Induction of decision trees." Machine Learning, 1:81-106, 1986.

### Optimizing Warehouse Item Transportation using Multi-Hop Robotic Networks (Final Year Project)
Demo: https://www.youtube.com/watch?v=lE7WI73rEzg

> The adoption of robotic systems in industrial environments like warehouses is often hampered by their slow operational speeds, high costs, and the need for substantial infrastructure for implementation. The complexity of individual robots, needed for the sensors and actuators required to avoid collisions, further escalates these challenges. This project introduces a distributed approach for route calculation, path finding, and coordination between robots. A warehouse is segmented into regions sized by local workload, and every robot is restricted to one region for the duration of a delivery cycle, eliminating collisions and lowering the cost of sensors and actuators. Deliveries outside a robot's own region move through a pick-and-pass, multi-hop mechanism, where a robot leaves an item at an exchange point between two regions for the next robot to pick up. The mechanism runs autonomously with minimal server involvement. The approach was demonstrated with three physical line-following robots and backed by Python simulations.
