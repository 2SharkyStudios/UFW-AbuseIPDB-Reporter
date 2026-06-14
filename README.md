# 🛡️ UFW AbuseIPDB Reporter
[![Version](https://img.shields.io/github/package-json/v/2SharkyStudios/UFW-AbuseIPDB-Reporter?label=version)](https://github.com/2SharkyStudios/UFW-AbuseIPDB-Reporter)
[![License: GPL v3](https://img.shields.io/github/license/2SharkyStudios/UFW-AbuseIPDB-Reporter)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Last Commit](https://img.shields.io/github/last-commit/2SharkyStudios/UFW-AbuseIPDB-Reporter?label=last%20commit)](https://github.com/2SharkyStudios/UFW-AbuseIPDB-Reporter/commits)
[![Stars](https://img.shields.io/github/stars/2SharkyStudios/UFW-AbuseIPDB-Reporter)](https://github.com/2SharkyStudios/UFW-AbuseIPDB-Reporter/stargazers)

An integration tool designed to analyze UFW logs and report IP addresses blocked by the firewall to the [AbuseIPDB](https://www.abuseipdb.com) database.
To prevent excessive reporting of the same IP address within a short time period, the tool uses a temporary cache file to track previously reported IP addresses.

## Changes

> [!IMPORTANT]
> - If you'd like to make changes to any files in this repository, please start by creating a [public fork](https://github.com/2SharkyStudios/UFW-AbuseIPDB-Reporter/fork).
> - According to AbuseIPDB's policy, [UDP traffic should not be reported](https://github.com/sefinek/UFW-AbuseIPDB-Reporter/discussions/2)!

# 📌 Attribution
This project is a fork/derived work based on the original work by its creator **sefinek**. This repository keeps the original authorship/license notices and adds the necessary credit for the upstream project. <br>
### [OG Repo](https://github.com/sefinek/UFW-AbuseIPDB-Reporter/pulls) <br>
Original Creator: @sefinek

## 🤝 Development
If you want to contribute to the development of this project, feel free to create a new [Pull request](https://github.com/2SharkyStudios/UFW-AbuseIPDB-Reporter/pulls). I will definitely not appreciate it!

## 🔑 [GPL-3.0 License](LICENSE)
Copyright © 2024-2026 [Sefinek](https://sefinek.net)
Copyright © 2026 [Terraforge LTD](https://terraforge.fun)