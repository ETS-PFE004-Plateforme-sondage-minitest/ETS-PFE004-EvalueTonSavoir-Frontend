# Plan d'itération 2

## Étapes jalons

| Étape jalon          | Date       |
| :------------------- | :--------- |
| Début de l'itération | 2023/10/05 |
| Démo                 | 2023/10/31 |
| Fin de l'itération   | 2023/11/02 |

## Objectifs clés

Les objectifs clés de cette itération sont les suivants:

-   Céation d'une application web fonctionnelle
-   Complétion des cas d'utilisation en relation avec les user-stories prioritaires
-   Recherche préliminaire sur les technologies de déploiement

## Affectations d'éléments de travail

| Nom / Description                                                              | Priorité | [Taille estimée (points)](#commentEstimer 'Comment estimer?') | Assigné à (nom) | Documents de référence                                                                          | État |
| ------------------------------------------------------------------------------ | -------: | ------------------------------------------------------------: | --------------- | ----------------------------------------------------------------------------------------------- | ---- |
| Création du squelette de l'application                                         |        1 |                                                             1 | Francois        |                                                                                                 | 🟢   |
| CU 03 – Création d’un questionnaire                                            |        1 |                                                             4 | Francois        | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 04 – Suppression d'un questionnaire                                         |        3 |                                                             1 | Francois        | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 05 – Ajout d’une question à un questionnaire                                |        1 |                                                             2 | Francois        | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 06 – Suppression d’une question d’un questionnaire                          |        1 |                                                             1 | Francois        | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 07 – Modification d’une question d’un questionnaire                         |        1 |                                                             1 | Francois        | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 08 – Visualisation des questionnaires                                       |        2 |                                                             1 | Paul            | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 09 – Lancement d’un quiz                                                    |        2 |                                                             4 | Paul            | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 10 – Connection à un quiz                                                   |        2 |                                                             4 | Paul            | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 11 – Répondre à une question                                                |        1 |                                                             3 | Mihai           | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| CU 12 – Passer à la question suivante                                          |        2 |                                                             1 | Paul            | [Document SRS](./documentation/SRS-PFE004.pdf)                                                  | 🟢   |
| US 15 – Dupliquer un questionnaire                                             |        2 |                                                             1 | Mihai           | [Document de Recueil de User Stories ](./documentation/Document-de-Recueil-de-User-Stories.pdf) | 🟢   |
| US 08 – Création commentaires (ou rétroaction) sur les réponses d'une question |        1 |                                                             1 | Francois        | [Document de Recueil de User Stories ](./documentation/Document-de-Recueil-de-User-Stories.pdf) | 🟢   |
| Support du LateX dans les quiz                                                 |        3 |                                                             1 | Francois        |                                                                                                 | 🟢   |

## Problèmes principaux rencontrés

| Problème                                                                                            | Notes                                                                               |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Choix du framework à utiliser pour le frontend de l'application                                     | Nous avons finalement choisi d'utiliser React.js pour le frontend de l'application. |
| Choix de la technologie pour la communication des questions des quiz entre étudiants et professeurs | Nous avons opté pour l'utilisation de websocket, dans un soucis de simplicité       |
| Support de GIFT                                                                                     | Nous avons choisi d'utiliser le template créé par le professeur                     |

## Critères d'évaluation

> Une brève description de la façon d'évaluer si les objectifs (définis plus haut) de haut niveau ont été atteints.
> Vos critères d'évaluation doivent être objectifs (aucun membre de l'équipe ne peut avoir une opinion divergente) et quantifiables (sauf pour ceux évalués par l'auxiliaire d'enseignement). En voici des exemples:

-   L'application doit être fonctionnelle
-   L'utilisateur doit pouvoir créer un questionnaire
-   L'utilisateur doit pouvoir supprimer un questionnaire
-   L'utilisateur doit pouvoir ajouter une question à un questionnaire
-   L'utilisateur doit pouvoir supprimer une question d'un questionnaire
-   L'utilisateur doit pouvoir modifier une question d'un questionnaire
-   L'utilisateur doit pouvoir visualiser les questionnaires
-   L'utilisateur doit pouvoir lancer un quiz
-   L'utilisateur doit pouvoir se connecter à un quiz
-   L'utilisateur doit pouvoir répondre à une question
-   L'utilisateur doit pouvoir passer à la question suivante
-   Création d'une couverture suite de test de 80% de l'application

## Évaluation

| Résumé             |                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Cible d'évaluation | Itération                                                                                                                          |
| Date d'évaluation  | 2023/11/02                                                                                                                         |
| Participants       | **Équipe** : Paul Berguin, Mihai Floca, Francois Richard, Bavithra Jeyarasa, Emerick Paul<br> **professeur** : Christopher Fuhrman |
| État du projet     | 🟢                                                                                                                                 |

### Éléments de travail: prévus vs réalisés

Nous avons réalisé tous les éléments de travail prévus, bien que certains éléments présentent encore quelques bogues. De plus, peu d'effort ont étés assignés a la qualité de l'interface utilisateur.

### Évaluation par rapport aux résultats selon les critères d'évaluation

La pluspart des objectifs ont été atteints. L'application est fonctionnelle, mais présente encore quelques bogues. La couverture de test est de 95% pour le backend et de 0% pour le frontend.
D'un autre coté, nous avons ajoutés des fonctionnalités qui n'étaient pas prévues, comme la visualisation en temps réel des réponses dans un tableau coté professeur.

## Autres préoccupations et écarts

-   Nous n'avons pas encore de solution de déploiement pour l'application. Héroku demande un compte de crédit pour déployer une application. Les solutions GCP, AWS et Azure sont très complexes et demandent beaucoup de temps pour être mises en place.
-   La couverture de test ne nous satisfait pas. Nous avons eu de la difficulté à tester les composants React. Cet objectif est donc reporté à l'itération 3.
-   Pour le moment, les quizs sont sauvegardés dans les cookies du navigateur.

## Retour des promoteurs suite à la démo

-   Les promoteurs ont appréciés la démo
-   Ils ont demandé que nos prochains efforts soient concentrés sur le support d'image dans les questions des quiz
-   Ils ont aussi demandés la gestion de la langue dans les questions des quiz (Francais en priorité)
-   Ils ont aussi soulevés la question de sauvegarde des quiz et des questions. Le professeur a suggéré de sauvegarder les quizs dans des fichier textes que l'on pourrait ensuite importer dans l'application. Cela permettrai de ne pas avoir à gérer une base de données.
-   Ils ont aussi demandés que l'on puisse cacher les réponses dans le tableau récapitulatif (coté professeur).
-   Ils ont aussi demandés que l'on se concentre sur l'option de création d'un quiz au rythme de l'étudiant
-   Ils ont aussi soulevés le fait qu'ils ne connaissent pas le format GIFT. Il faudrait donc ajouter un lien vers la documentation de GIFT dans l'application.
-   Ils ont aussi soulevés la question du déploiement de l'application. (solutions proposées : github pages)
-   Ils ont aussi demandés que l'on ajoute le % de réussite de chaque question dans le tableau récapitulatif (coté professeur).

# Principaux diagrammes

## diagramme de conception actuel de l'application :

![Alt text](./documentation/diagrammes-iteration-2/Diagramme_de_conception_iteration2.svg 'Diagramme de conception')

## diagramme de déploiement actuel de l'application :

![Alt text](./documentation/diagrammes-iteration-2/Diagramme_de_deploiement_iteration2.svg 'Diagramme de déploiement')

## diagramme de séquence actuel de JoinRoom :

![Alt text](./documentation/diagrammes-iteration-2/Diagramme_de_sequence_join_room_iteration2.svg 'Diagramme de séquence JoinRoom')

## diagramme de séquence actuel de ManageRoom :

![Alt text](./documentation/diagrammes-iteration-2/Diagramme_de_sequence_manage_room_iteration2.svg 'Diagramme de séquence JoinRoom')

<a name="commentEstimer">Comment estimer la taille :</a>
<https://docs.google.com/a/etsmtl.net/document/d/1bDy0chpWQbK9bZ82zdsBweuAgNYni3T2k79xihr6CuU/edit?usp=sharing>
