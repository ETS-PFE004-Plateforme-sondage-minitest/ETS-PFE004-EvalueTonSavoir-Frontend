# Plan d'itération 3

## Étapes jalons

| Étape jalon          | Date       |
| :------------------- | :--------- |
| Début de l'itération | 2023/11/03 |
| Démo                 | 2023/10/13 |
| Fin de l'itération   | 2023/11/16 |

## Objectifs clés

Les objectifs clés de cette itération sont les suivants:

-   Création d'une option de création de quiz au rythme des étudiants
-   Support des images dans les questions
-   Support des formules mathématiques dans les questions
-   Gestion de l'import/export des questionnaires
-   Déploiement d'un prototype de l'application

## Affectations d'éléments de travail

| Nom / Description                                                                                   | Priorité | [Taille estimée (points)](#commentEstimer 'Comment estimer?') | Assigné à (nom) | Documents de référence                                                                          | État |
| --------------------------------------------------------------------------------------------------- | -------: | ------------------------------------------------------------: | --------------- | ----------------------------------------------------------------------------------------------- | ---- |
| US 08 – Questionnaire au rythme de l'étudiant                                                       |        1 |                                                             2 | Paul            | [Document de Recueil de User Stories ](./documentation/Document-de-Recueil-de-User-Stories.pdf) | 🟢   |
| US 17 – Rétroaction a une question répondu par l'étudiant                                           |        1 |                                                             2 | Mihai           | [Document de Recueil de User Stories ](./documentation/Document-de-Recueil-de-User-Stories.pdf) | 🟢   |
| US 04 – Support des images                                                                          |        1 |                                                             4 | Bavithra        | [Document de Recueil de User Stories ](./documentation/Document-de-Recueil-de-User-Stories.pdf) | 🔴   |
| Suite a la démo précédente : Import/Export des questionnaires                                       |        2 |                                                             4 | Emerick         |                                                                                                 | 🔴   |
| Suite a la démo précédente : Création d'une documentation GIFT                                      |        2 |                                                             1 | Francois/Paul   |                                                                                                 | 🟢   |
| Suite a la démo précédente : Déploiement d'un prototype Frontend de l'application                   |        3 |                                                             3 | Mihai           |                                                                                                 | 🟢   |
| Suite a la démo précédente : Déploiement d'un prototype Backend de l'application                    |        3 |                                                             3 | Paul            |                                                                                                 | 🟢   |
| Suite a la démo précédente : Ajout du % de réussite des questions dans le tableau                   |        2 |                                                             1 | Paul            |                                                                                                 | 🟢   |
| Suite a la démo précédente : traduction de l'application de l'anglais vers le Francais              |        1 |                                                             1 | tous            |                                                                                                 | 🟠   |
| Suite a la démo précédente : Ajout de l'option de cacher les réponses dans le tableau en temps réel |        2 |                                                             1 | Paul            |                                                                                                 | 🟢   |

## Problèmes principaux rencontrés

| Problème                                               | Notes                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Support de l'image dans l'éditeur de quiz              | Afin d'accélerer l'avancée du projet, nous avons opté pour un éditeur, choix qui complique le support de l'image pour chaque question                                                                                                                                                                    |
| Support du import/export de fichiers textes pour quizs | Nous avons pris plus de temps que prévu pour réaliser cette fonctionnalité.                                                                                                                                                                                                                              |
| déploiement de l'application backend                   | Nous avons essayer plusieurs options. Nous avons essayer de déployer le backend sous forme de docker sur Azure. Nous avons aussi déployer notre backend avec glitch.com. Le docker a couté 4$ sans appel un weekend. Gitch.com est gratuit mais turn off l'application au bout de 5 minutes d'inactivité |

## Critères d'évaluation

> Une brève description de la façon d'évaluer si les objectifs (définis plus haut) de haut niveau ont été atteints.
> Vos critères d'évaluation doivent être objectifs (aucun membre de l'équipe ne peut avoir une opinion divergente) et quantifiables (sauf pour ceux évalués par l'auxiliaire d'enseignement). En voici des exemples:

-   Tous les tests unitaires passent
-   Les fonctionnalités discutés durant la derniere démo sont implémentées
-   L'application est déployée

## Évaluation

| Résumé             |                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Cible d'évaluation | Itération                                                                                                                          |
| Date d'évaluation  | 2023/11/16                                                                                                                         |
| Participants       | **Équipe** : Paul Berguin, Mihai Floca, Francois Richard, Bavithra Jeyarasa, Emerick Paul<br> **professeur** : Christopher Fuhrman |
| État du projet     | 🟠                                                                                                                                 |

### Éléments de travail: prévus vs réalisés

Certains des éléments de travail prévus n'ont pas été réalisés.

-   L'import/export de quizs n'a pas été réalisé.
    -   En effet, nous avons eu de la difficulté à trouver une solution pour importer/exporter des quizs. Nous avons essayé plusieurs solutions, mais aucune n'a fonctionné. Nous avons donc décidé de reporter cette fonctionnalité à l'itération 4. Nous prioriserons cette fonctionnalité pour l'itération 4.
-   Le support des images dans les questions n'a pas été réalisé.
    -   Le choix d'utiliser un éditeur de texte pour les questions a compliqué le support des images. Nous avons donc décidé de reporter cette fonctionnalité à l'itération 4. Nous prioriserons cette fonctionnalité pour l'itération 4.
    -   Nous pensons qu'il serait intéressant, pour les prochaines itérations, de gerer la création des questions avec un composant personnalisé qui permettrait de créer des questions en n'utilisant que des boutons et avec des champs spécifiques pour le contenu des questions/réponses. Cela permettrait de simplifier le support des images et des formules mathématiques.
-   La traduction de l'application est partiellement réalisée.
-   Nous avons travailler sur l'interface graphique de l'application.

La plupart des éléments de travail prévus ont été réalisés.

### Évaluation par rapport aux résultats selon les critères d'évaluation

-   Tous les tests unitaires passent
    -   Nous avons ajouté des tests unitaires pour les composants React (il faut encore en ajouter). Nous avons aussi ajouté des tests unitaires pour le backend.
-   Les fonctionnalités discutés durant la derniere démo sont partiellement implémentées. (7.5/10)
-   L'application est déployée
    -   Nous avons déployé le backend sur glitch.com. L'application est disponible à l'adresse suivante : https://ets-glitch-backend.glitch.me/
    -   Nous avons déployé le frontend sur Vercel. L'application est disponible à l'adresse suivante : https://evaluetonsavoir.vercel.app/

## Autres préoccupations et écarts

-   La solution de déploiement du backend n'est pas idéale. Nous avons essayé de déployer le backend sur Azure, mais cela nous a couté 4$ sans appel un weekend. Nous avons donc décidé de déployer le backend sur glitch.com. Cependant, glitch.com turn off l'application au bout de 5 minutes d'inactivité. Glitch.com n'est pas une solution idéale pour le déploiement d'une application. Cependant pour un prototype, cette solution nous satisfait. Nous envisageons de discuter avec les promoteurs pour explorer d'autres solutions de déploiement.
-   Le support du LateX coté étudiant n'est toujours pas implémenté. Nous avons décidé de prioriser cette fonctionnalité à l'itération 4.

## Retour des promoteurs suite à la démo

-   Les promoteurs ont appréciés la démo
-   Ils ont repéré quelques bogues
    -   pas de bouton de déconnexion
    -   reload des pages ne fonctionne pas sur la solution déployée
    -   probleme de connexion a un nom de salle inexistant
    -   nom de la salle en chiffres uniquement
    -   support du LateX coté étudiant
-   Ils ont demandés la possibilité de retourner sur une question (dans le tableau des résultats en temps réel) pour donner de meilleur rétroaction aux étudiants
-   Ils ont demandés de prioriser :
    -   le support du LateX coté étudiant
    -   le support des images dans les questions
    -   l'import/export des questionnaires

# Principaux diagrammes

pas de changements majeurs par rapport à l'itération 2

<a name="commentEstimer">Comment estimer la taille :</a>
<https://docs.google.com/a/etsmtl.net/document/d/1bDy0chpWQbK9bZ82zdsBweuAgNYni3T2k79xihr6CuU/edit?usp=sharing>
