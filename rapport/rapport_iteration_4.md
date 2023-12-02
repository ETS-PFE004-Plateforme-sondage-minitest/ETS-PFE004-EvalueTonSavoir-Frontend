# Plan d'itération 3

## Étapes jalons

| Étape jalon          | Date       |
| :------------------- | :--------- |
| Début de l'itération | 2023/11/17 |
| Démo                 | 2023/12/05 |
| remise du projet     | 2023/12/13 |
| Présentation finale  | 2023/12/13 |
| Fin de l'itération   | 2023/12/13 |

## Objectifs clés

Les objectifs clés de cette itération sont les suivants:

-   Création d'une option de création de quiz au rythme des étudiants
-   Support des images dans les questions
-   Support des formules mathématiques dans les questions
-   Gestion de l'import/export des questionnaires
-   Déploiement d'un prototype de l'application

## Affectations d'éléments de travail

| Nom / Description                                                                                 | Priorité | [Taille estimée (points)](#commentEstimer 'Comment estimer?') | Assigné à (nom)  | Documents de référence | État |
| ------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------: | ---------------- | ---------------------- | ---- |
| Suite a la démo précédente : traduction de l'application de l'anglais vers le Francais            |        2 |                                                             1 | tous             |                        | 🟢   |
| Suite a la démo précédente : import/export des questionnaires                                     |        1 |                                                             4 | Mihai            |                        | 🟢   |
| Suite a la démo précédente : support des images                                                   |        1 |                                                             4 | Paul             |                        | 🟢   |
| Suite a la démo précédente : nom de salle en chiffres                                             |        3 |                                                             1 | Paul             |                        | 🟢   |
| Suite a la démo précédente : reload fonctionnel sur vercel                                        |        1 |                                                             1 | Mihai            |                        | 🟢   |
| Suite a la démo précédente : bouton de déconnexion lorsqu'un quiz est lancé                       |        3 |                                                             1 | Paul             |                        | 🟢   |
| Suite a la démo précédente : support du LateX coté étudiant                                       |        1 |                                                             4 | Francois         |                        | 🟢   |
| Suite a la démo précédente : retour sur une question dans le tableau des résultats en temps reels |        3 |                                                             1 | Paul             |                        | 🟢   |
| déploiement continue des applications                                                             |        3 |                                                             1 | tous             |                        | 🟢   |
| Finaliser les suites de tests et les ajouter aux déploiement continue des application             |        3 |                                                             4 | Bavithra/Emerick |                        | 🟢   |
| Amélioration de l'interface utilisateur                                                           |        4 |                                                             4 | Mihai            |                        | 🟢   |
| Investigation d'une autre solution de déploiement backend                                         |        4 |                                                             4 | tous             |                        | 🟠   |

## Problèmes principaux rencontrés

| Problème                                                                                                                 | Notes                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Support de l'image dans l'éditeur de quiz                                                                                | Le support de l'image fonctionne mais nous pensons qu'il peut être amélioré, surtout si on se détache de l'éditeur de questionnaire sous forme de texte                                                               |
| choix de librairie pour les composants visuel                                                                            | Nous avons longtemps hésiter d'utiliser une librairie pour le coté visuel (bootstrap ou autre). Nous avons finalement décidé d'utiliser Material UI. Cela nous permet d'avoir un visuel beaucoup plus professionnel.  |
| choix du composant pour l'affichage des questions et choix de réponses coté étudiant                                     | Nous hésitons entre utiliser le composant GIFTTemplate, ou créer un composant spécifique. La seconde solution serait plus intéressante car plus personnalisable mais ajoute de la complexité au developpement.        |
| Les utilisateurs sur téléphones sont déconnecté s'ils sont trop longtemps inactifs et que le téléphone se met en veille. | L'équipe hésite sur le fait que cette fonctionnalité soit un problème ou non. Nous avons décidé de laisser le comportement tel quel pour le moment. Cela permet de fermet au maximum le nombre de connexions ouvertes |
| Certaines des adresses d'images ne fonctionnent pas                                                                      | Nous n'avons pas eu le temps d'investiguer ce problème                                                                                                                                                                |
| Support de l'exportation des documents sous format pdf                                                                   | Nous n'avons pas eu le temps de supporter cette fonctionnalité                                                                                                                                                        |

## Critères d'évaluation

> Une brève description de la façon d'évaluer si les objectifs (définis plus haut) de haut niveau ont été atteints.
> Vos critères d'évaluation doivent être objectifs (aucun membre de l'équipe ne peut avoir une opinion divergente) et quantifiables (sauf pour ceux évalués par l'auxiliaire d'enseignement). En voici des exemples:

-   Tous les tests unitaires passent (couverture de 80%)
-   Les fonctionnalités discutés durant la derniere démo sont implémentées

## Évaluation

| Résumé             |                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Cible d'évaluation | Itération                                                                                                                          |
| Date d'évaluation  | 2023/11/16                                                                                                                         |
| Participants       | **Équipe** : Paul Berguin, Mihai Floca, Francois Richard, Bavithra Jeyarasa, Emerick Paul<br> **professeur** : Christopher Fuhrman |
| État du projet     | 🟢                                                                                                                                 |

### Éléments de travail: prévus vs réalisés

Tous les éléments de travail prévus ont été réalisés. Nous avons aussi complêtement retravailler l'interface utilisateur pour la rendre plus professionnelle.
De plus nous avons une couverture de test très satisfaisante.
Enfin, nous avons intégré un système de déploiement continue pour le backend et le frontend.

### Évaluation par rapport aux résultats selon les critères d'évaluation

## Autres préoccupations et écarts

## Retour des promoteurs suite à la démo

## Propositions d'amélioration

Lors de cette session, notre équipe s'est concentrée sur l'implémentation des fonctionnalités éssentielles de l'application. Notre objectif principal était de livrer un produit fonctionnel, bien qu'imparfait. Cela permettra aux promoteurs de tester l'application avec des utilisateurs réels et donner un retour sur les améliorations à apporter et les bug rencontrés.

Le produit que nous livrons est donc un prototype fonctionnel. Nous avons donc laissé de coté certaines fonctionnalités qui pourraient être intéressantes pour la prochaine équipe. Voici une liste de ces fonctionnalités et nos commentaires sur leur importance:

| amélioration                                           | Commentaire                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| support de tous les types de question                  | Pour le moment on ne supporte que 4 types de question (composants \components\Questions ). Il serait intéressant de supporter tous les types de GIFT ce qui permettrait une meilleur portabilité des quiz. En effet les promoteurs pourrait avoir envie d'importer un quiz depuis moodle vers notre solution.                                                                                                                                                                                                          |
| Refactoring de de la page EditorQuiz                   | Actuellement l'application propose a l'utilisateur de créer les quiz en écrivant directement sous format GIFT dans un éditeur de text. Il serait intéressant de se débarrasser de cet éditeur et de permettre a l'utilisateur de créer des quiz, d'ajouter des question, choisir leurs types et d'ajouter des réponses seulement en cliquant sur des boutons. De sorte qu'ils n'aient pas a se soucier du format.                                                                                                      |
| Refactoring l'interface graphique                      | Pour le moment l'interface graphique est correct, mais il serait intéressant de la poffiner afin de présenter un produit final plus poussé. Nous avons choisit de ne pas utiliser bootstrap dans un soucis de clarification du code et pour des question de futur performance. Nous n'avons pas non plus utilisés tailwind css dans l'optique de garder notre code HTML aussi clair que possible. Si un changement est envisagé au niveau de la technologie du UI. Nous conseillons Tailwind css plutot que Bootstrap. |
| Support de l'exportation des documents sous format pdf | Nous n'avons pas eu le temps de supporter cette fonctionnalité. Cependant, nous pensons que c'est une fonctionnalité importante. En effet, cela permettrait aux professeurs de pouvoir imprimer les quiz et de les distribuer aux étudiants.                                                                                                                                                                                                                                                                           |

## Discussion sur le déploiement Backend (glitch ou Azure)

Cette décision a été compliqué pour notre équipe. Tout d'abord le fait que nous utilisons les websocket restreint les options de déploiement.

-   Notre premiere option a été Glitch, qui fournis une plateforme gratuite. Le déploiement continu a été implémenté pour cette plateforme. Le principal problème de cette plateforme est la mise en veille de notre backend après 5 minutes d'inactivité. L'avantage de Glitch par contre est que la plateforme permet d'héberger notre backend gratuitement.
-   D'un autre coté, Azure est aussi une plateforme intéréssante en raison de l'entente entre l'école et la plateforme. Aucun d'entre nous n'avais d'experience avec la plateforme, mais nous avons réussit a déployer grace a l'extension Azure sur VScode. L'option gratuite ne permettait que la connexion de 5 personnes en meme temps. Nous avons donc opté pour le plan Basic B1.

## Discussion sur le déploiement Frontend

Pour le frontend de notre application, nous avons hésité entre Héroku, GithubPages et Vercel. Au final nous avons choisi Vercel pour sa simplicité d'utilisation et son intégration avec Github. Nous avons aussi implémenté le déploiement continu pour le frontend.
Cependant après quelques temps d'utilisations nous avons remarqués quelques problèmes en raison de la gratuité de la plateforme. En effet, ce plan ne permet pas la création d'équipe pour gérer le projet et nous avons donc du désigner un membre de l'équipe pour gérer le projet.

# Principaux diagrammes

## Diagramme de classe

![Diagramme de conception du frontend](./documentation/diagrammes-iteration-4/Diagramme_conception_iteration4.svg)

## Diagramme de déploiement

![Diagramme de déploiement](./documentation/diagrammes-iteration-4/Diagramme_deploiement_iteration4.svg)

## Diagramme de séquence - Création d'une salle

![Diagramme de séquence - Création d'une salle](./documentation/diagrammes-iteration-4/Diagramme_de_sequence_creation_Room_iteration4.svg)

## Diagramme de séquence - Rejoindre une salle

![Diagramme de séquence - Rejoindre une salle](./documentation/diagrammes-iteration-4/Diagramme_de_sequence_join_room_iteration4.svg)

## Diagramme de séquence - déroulement d'un quiz

![Diagramme de séquence - déroulement d'un quiz](./documentation/diagrammes-iteration-4/Diagramme_de_sequence_deroulement_quiz_iteration4.svg)

<a name="commentEstimer">Comment estimer la taille :</a>
<https://docs.google.com/a/etsmtl.net/document/d/1bDy0chpWQbK9bZ82zdsBweuAgNYni3T2k79xihr6CuU/edit?usp=sharing>
