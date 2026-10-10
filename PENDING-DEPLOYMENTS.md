# Live URLs to supply

Eleven unique projects remain after the owner's selection and exclusion of Horror_die_Website. Six public deployments are connected to the interactive viewer. Production deployment records now exist for these five, but their recorded URLs redirect anonymous visitors to Vercel login. Their public production domains are needed:

| Project                 | Repository                                                        | Current state                                                   |
| ----------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Mardara-Expense-Tracker | [GitHub](https://github.com/SarimSheikh1/Mardara-Expense-Tracker) | Recorded deployment requires Vercel login                       |
| SNIPER-SHADOW           | [GitHub](https://github.com/SarimSheikh1/SNIPER-SHADOW)           | Recorded deployment requires Vercel login                       |
| TARGET-RUSH             | [GitHub](https://github.com/SarimSheikh1/TARGET-RUSH)             | Recorded deployment requires Vercel login                       |
| Mardara_Travel_Agent    | [GitHub](https://github.com/SarimSheikh1/Mardara_Travel_Agent)    | Recorded deployment requires Vercel login                       |
| todo-app                | [GitHub](https://github.com/SarimSheikh1/todo-app)                | New deployment requires Vercel login; old homepage returned 404 |

Add verified URLs to `liveUrls` in `src/data/projects.json` and rebuild. No substitute URLs or fake working demos have been created. The expense tracker's README describes a Node/Express/SQLite backend; host its required backend as part of that project's deployment rather than deploying only its static landing page.
