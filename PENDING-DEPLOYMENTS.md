# Live URLs to supply

Eleven unique projects remain after the owner's selection and exclusion of Horror_die_Website. Six public deployments are connected to the interactive viewer. These five need a working public HTTPS URL:

| Project                 | Repository                                                        | Current state                                            |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| Mardara-Expense-Tracker | [GitHub](https://github.com/SarimSheikh1/Mardara-Expense-Tracker) | No public deployment URL supplied                        |
| SNIPER-SHADOW           | [GitHub](https://github.com/SarimSheikh1/SNIPER-SHADOW)           | No public deployment URL supplied                        |
| TARGET-RUSH             | [GitHub](https://github.com/SarimSheikh1/TARGET-RUSH)             | No public deployment URL supplied                        |
| Mardara_Travel_Agent    | [GitHub](https://github.com/SarimSheikh1/Mardara_Travel_Agent)    | No public deployment URL supplied                        |
| todo-app                | [GitHub](https://github.com/SarimSheikh1/todo-app)                | Repository homepage returned HTTP 404 on 10 October 2026 |

Add verified URLs to `liveUrls` in `src/data/projects.json` and rebuild. No substitute URLs or fake working demos have been created. The expense tracker's README describes a Node/Express/SQLite backend; host its required backend as part of that project's deployment rather than deploying only its static landing page.
