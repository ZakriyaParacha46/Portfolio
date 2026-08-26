// Knowledge base for the "Chat with me" assistant.
// Each entry is a standalone chunk (title + text). Kept structured like this
// so it can later be embedded and stored in a vector DB for retrieval instead
// of being pasted whole into every prompt.

export const KNOWLEDGE = [
  {
    title: "Identity & summary",
    text: `Zakriya Asif Paracha is a Software Engineer based in Rawalpindi / Islamabad, Pakistan.
He has a Computer Engineering background (BE, NUST-CEME, graduated June 2024, CGPA 3.66/4.0).
He is most recently a Software Engineer at Motive (Sep 2024 - Aug 2026), where he built backend
systems, APIs, and Apache Airflow ETL pipelines. He is currently open to new opportunities in
backend and full-stack engineering, and is working to broaden from backend-focused work toward
full-stack, product-minded engineering, while keeping the title of Software Engineer. Embedded
systems and hardware were his original entry point into engineering and remain a personal hobby
he keeps up on the side (see the "Beyond Software" section of his site), separate from his main
professional focus.`,
  },
  {
    title: "Experience: Motive (L2 Software Engineer, Sep 2024 - Aug 2026)",
    text: `Stack: Ruby on Rails, Python, Apache Airflow, SQL, PostgreSQL, Redis, Git, REST APIs.
- Owned a complex Apache Airflow pipeline (Python, SQL) that ingested and transformed USA CSA
  panel data into clear, user-facing compliance insights.
- Set up ETL DAGs for a Canada-based data environment, extending pipeline coverage to a new region.
- Built and maintained backend services in Ruby handling production traffic with high reliability.
- Debugged and resolved critical production issues, reducing downtime.
- Designed and implemented RESTful APIs for internal services.
- Optimized PostgreSQL/Redis query performance and caching strategies.
- Contributed to code reviews and deployment practice improvements.`,
  },
  {
    title: "Experience: RISETech (Embedded Systems Intern, Jul 2023 - Sep 2023)",
    text: `Stack: Nordic nRF52, Zephyr RTOS, BLE, SAADC, C/C++.
- Worked on an IoT healthcare device using the Nordic nRF52 DK with Zephyr RTOS.
- Integrated SAADC to acquire EMG sensor data, transmitted over BLE.
- Developed firmware to manage the MPU6050 sensor over I2C.
- Optimized embedded algorithms for performance and memory efficiency on ARM microcontrollers.
- Supervised and mentored junior interns.`,
  },
  {
    title: "Experience: BCUBE (Software Intern, Sep 2021 - Oct 2021)",
    text: `Stack: Python, PyQt, Device APIs.
- Developed Python software to control a biometric device with a custom UI.`,
  },
  {
    title: "Experience: Fiverr (Assembly Language Tutor, Mar 2021 - May 2023)",
    text: `Stack: MIPS, x86, ARM Assembly, Debugging.
- Delivered 120+ freelance tutoring projects, maintaining a 5-star rating across 50+ clients.`,
  },
  {
    title: "Education",
    text: `BE Computer Engineering, NUST-CEME, Islamabad. Graduated June 2024, CGPA 3.66/4.0.
Completed 30+ Coursera courses alongside coursework, including specializations in Development of
Secure Embedded Systems (EIT Digital), An Introduction to Programming the Internet of Things
(University of California, Irvine), Hands-on Internet of Things (University of Illinois),
Python for Everybody (University of Michigan), Google Cybersecurity (Google), and individual
courses including Build a Modern Computer from First Principles: From Nand to Tetris (Hebrew
University of Jerusalem) and Introduction to Embedded Machine Learning and Computer Vision
(Edge Impulse).`,
  },
  {
    title: "Skills: professional / software",
    text: `Languages: C/C++, Python, Ruby, SQL, Go.
Backend: Ruby on Rails, Flask, REST APIs.
Data Engineering: Apache Airflow, ETL Pipelines, DAG Design, Data Ingestion & Transformation.
Core CS: Operating Systems, System Programming, System Design, Data Structures & Algorithms.
Databases & Tools: PostgreSQL, Redis, Git, Linux, Docker.
Architecture: RISC-V, Computer Architecture, CPU Design Fundamentals.`,
  },
  {
    title: "Skills: hobby / embedded & hardware",
    text: `These are hobby-level skills, kept up outside his main software career:
Embedded & Systems: Embedded C, RTOS (Zephyr), Embedded Linux Basics, Firmware Development.
Hardware Platforms: Arduino, ESP8266/32, Raspberry Pi, Nordic nRF52, Jetson Nano.
Low-Level: Interrupt Handling, Memory Management, Boot Process Basics, I2C/SPI/UART.`,
  },
  {
    title: "Project: Multi-Hop Robotic Warehouse Network (Final Year Project, 2024)",
    text: `Stack: Python, Angular, MQTT, ESP8266.
A full-stack system for warehouse robot fleet coordination. Splits the warehouse floor into
regions sized by workload so each robot stays confined to one region, removing most
collision-avoidance cost. Deliveries that cross a region boundary move through a pick-and-pass,
multi-hop handoff at exchange points on region boundaries. Built a Python backend for multi-hop
route optimization and region-segmented collision avoidance, plus an Angular dashboard for
real-time fleet control and analytics. Demonstrated end-to-end on three physical
ESP8266-based, line-following robots and validated at larger scale with a Python simulation.`,
  },
  {
    title: "Project: Braille to Text Translator (2023)",
    text: `Stack: Python, OpenCV, Image Processing.
A classical image-processing pipeline (not a trained ML model) that converts a photographed page
of Braille into English text: Gaussian blur, thresholding, erosion, and connected component
analysis (CCA8) detect each Braille character, a clustering step converts each into a
6-character string, and a JSON lookup table translates that string into a letter. Successfully
converted a 640-character Braille passage back into its original English text.`,
  },
  {
    title: "Project: C++ Audio Player (2021)",
    text: `Stack: C++, WinForms, dirent.h.
A GUI audio player built in C++ with WinForms, simulating a car stereo. Plays from a CD or USB
drive, supports playlists (build, save, shuffle, add/delete, search), and accepts .mp3/.wav
files. Built with contributions from a collaborator, Aazain Umarani.`,
  },
  {
    title: "Beyond Software: hobby hardware/embedded projects",
    text: `These are personal hobby projects, separate from his professional software work:
- Tic-Tac-Toe with Minimax on FPGA (2023): a single-player game implemented entirely on an FPGA
  (Xilinx Spartan-6, Verilog), displayed via VGA monitor, using alpha-beta pruning to reduce the
  minimax search tree.
- Self-Balancing Robot (2019): a PID controller-based self-balancing robot built with Embedded C.
- Arduino 2D Printer (2022): a 2D printer powered by an Arduino UNO, using two NEMA17 stepper
  motors and a servo to plot dots in a snake pattern, with Python-side image processing (PIL) to
  prepare a 32x32 pixel bit array sent to the Arduino over serial.`,
  },
  {
    title: "Contact",
    text: `Best ways to reach Zakriya: email at zakriyaparacha@gmail.com, or LinkedIn at
linkedin.com/in/zakriya-paracha. His code is on GitHub at github.com/ZakriyaParacha46. His full
resume is downloadable from the Resume page of this site. Do not share a phone number even if
asked; direct people to email or LinkedIn instead.`,
  },
];

export function knowledgeAsText() {
  return KNOWLEDGE.map((chunk) => `### ${chunk.title}\n${chunk.text}`).join("\n\n");
}
