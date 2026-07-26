# Écart au plan — art antérieur sur la référence de planification

Recherche instruite le 2026-07-25, sur sources primaires.

**Question instruite.** PKF veut représenter un *écart au plan* (délai,
et charge en jours·homme) au niveau des agrégats de pilotage
(`Milestone`, `Project`), jamais sur `Action`. Une seule fourche est
ouverte : **où vit le plan de référence — un jeu de champs figés
côte à côte sur l'objet, ou un objet de replanification distinct et
daté ?**

**Ce que ce document n'est pas.** Ce n'est pas un panorama de la
gestion de projet. Trois familles de sources sont interrogées sur les
mêmes trois axes :

- **axe 1** — la référence est-elle un *jeu de champs sur l'objet* ou
  une *entité distincte* ?
- **axe 2** — combien de *générations* de référence sont conservées ?
- **axe 3** — à quoi la nouvelle référence est-elle *rattachée* (une
  date, un auteur, une décision formelle, une raison) ?

L'axe 3 est celui qui tranche : PKF possède déjà un objet `Decision`
(`decision_date`, `decision_maker`, `rationale`,
`impact_description`, `superseded_by`), donc savoir si la
re-baseline est *modélisée* ou seulement *rituelle* décide de la
fourche.

---

## 0. Statut des sources

**Vérifié sur source primaire, page effectivement récupérée :**

- Microsoft Project — pages `support.microsoft.com` sur la création de
  baseline et sur les champs `Start Variance`, `Work Variance`,
  `Baseline1-10 Start` ; pages `learn.microsoft.com` de la référence
  VBA (`Project.BaselineSavedDate`, `Application.BaselineSave`).
- MPXJ — javadoc `Task`, `ProjectProperties`, `ProjectFile`,
  `TaskField` ; page « How To: Use Baselines ».
- GanttProject — code source sur `raw.githubusercontent.com`
  (sérialiseur, parseur, classes de schéma XML).
- OpenProject — documentation API et guide utilisateur.
- PMI — *Lexicon of Project Management Terms* v4.0 (2024) ;
  *ERRATA — PMBOK Guide Sixth Edition (Fifth Printing)*, PDF public
  hébergé par PMI, qui **joint les pages corrigées** 113/114/116 et
  contient donc le texte réel de §4.6 ; FAQ publique PMBOK 7e édition.

**Non vérifié / confiance dégradée, signalé comme tel dans le texte :**

- PMBOK 6e édition §4.6.3 (prose des *outputs*) — non lu sur primaire ;
  seuls les schémas 4-12 / 4-13 et §4.6.1 le sont.
- PMBOK 7e édition, taxonomie des *artifacts* — reconstituée sur
  sources secondaires uniquement.
- Le *Lexicon* PMI a dû être récupéré sur un miroir universitaire,
  `pmi.org` renvoyant un 403 sur l'URL officielle. Le fichier
  s'auto-identifie comme « PMI Lexicon of Project Management Terms,
  Version 4.0, ©2024 Project Management Institute, Inc. ». Confiance
  haute sur le contenu, mais l'hôte n'est pas PMI.
- Primavera P6 et Asta Powerproject sont décrits *à travers* MPXJ,
  pas via la documentation Oracle ou Elecosoft.

---

## 1. Microsoft Project — la référence comme champs figés

### 1.1 Axe 1 : jeu de champs sur l'objet

Sans ambiguïté : des champs, sur la tâche. Microsoft décrit la
baseline comme « a group of nearly 20 primary reference points (in
five categories: start dates, finish dates, durations, work, and cost
estimates) that you can set to record the original project plan »
([support.microsoft.com][ms-baseline]).

La copie est explicite dans la définition du champ : « Setting a
baseline copies the currently scheduled fields for tasks into the
corresponding baseline fields »
([support.microsoft.com][ms-bl1-10-start]).

Il n'existe **aucune entité baseline** : MPXJ le confirme en creux,
`Task.getBaselineTask()` « will always be [null] for MPP files as
Microsoft Project doesn't keep a separate copy of the baseline
schedule » ([mpxj.org][mpxj-baselines]).

Point important pour PKF : ces champs figés ne sont pas protégés.
L'`Entry Type` documenté de `Baseline1-10 Start` est « Calculated or
entered » ([support.microsoft.com][ms-bl1-10-start]), et MPXJ le dit
plus crûment : « the baseline attributes you have captured as part of
this process have no special properties: they can be edited once they
have been captured, and no recalculation takes place if they are
edited » ([mpxj.org][mpxj-baselines]).

En revanche l'**écart lui-même n'est pas stocké** : il est dérivé.
`Start Variance` a pour `Entry Type` « Calculated » et pour formule
« Start Variance = Start - Baseline Start »
([support.microsoft.com][ms-start-var]) ; `Work Variance` a pour
`Entry Type` « Calculated » et pour formule « Work Variance = Work -
Baseline Work » ([support.microsoft.com][ms-work-var]).

### 1.2 Axe 2 : onze générations, plus dix plans intermédiaires

Onze jeux complets : « you can set additional baselines (to a total of
11 for each project) » ([support.microsoft.com][ms-baseline]) — soit
`Baseline` plus `Baseline 1` à `Baseline 10`.

À quoi s'ajoute un mécanisme distinct et plus léger, le *interim plan*
(plan intermédiaire) : il ne conserve que « Current start dates » et
« Current finish dates », et l'on peut en créer « up to 10 interim
plans for a project » ([support.microsoft.com][ms-baseline]). C'est
une référence *partielle* — dates seulement, pas de charge ni de coût
— précisément parce que figer les vingt points de référence à chaque
point de contrôle est trop cher.

Le coût de cette approche est mesurable. L'énumération `TaskField` de
MPXJ, qui reproduit fidèlement le modèle de données de MS Project,
contient **176 constantes `BASELINE*`** au niveau de la tâche (11
générations × 16 attributs), plus `START1`..`START10` et
`FINISH1`..`FINISH10` pour les plans intermédiaires
([mpxj.org][mpxj-taskfield], comptage vérifié sur la page javadoc).
C'est le point d'arrivée de la voie « champs figés » quand on la
pousse à `n` générations.

### 1.3 Axe 3 : une date, et rien d'autre

Une date est bien conservée : « After a baseline is saved, the date
when it was saved is included next to it in the list of baselines »
([support.microsoft.com][ms-baseline]). Elle est exposée par l'API :
`Project.BaselineSavedDate(Baseline)` — « Gets date the specified
baseline was last saved. Read-only **Variant** », et « If the
specified baseline has not been saved, **BaselineSavedDate** returns
"NA" » ([learn.microsoft.com][ms-vba-bsd]). Elle vit au niveau
**projet**, indexée par numéro de baseline, pas au niveau tâche.

Au-delà de cette date : **rien**. La méthode qui prend une baseline,
`Application.BaselineSave(All, Copy, Into, RollupToSummaryTasks,
RollupFromSubtasks, SetDefaults)`, n'a **aucun paramètre d'auteur, de
motif, de commentaire ni même de libellé**
([learn.microsoft.com][ms-vba-bs]). Il s'agit d'un résultat négatif
vérifié sur la référence d'API complète, pas d'une absence constatée
dans de la prose.

Aucun champ nommé « Baseline Save Date » n'apparaît par ailleurs dans
la liste des champs documentés côté tâche sur `support.microsoft.com`
— la date n'est pas un champ de tâche, seulement une propriété de
projet lisible par API et affichée dans la boîte de dialogue « Set
Baseline ».

La doctrine Microsoft sur la re-baseline est purement procédurale, et
tient en une phrase : « If changes to your plan occur while your
project is underway, you may find it helpful to save a second set of
baseline or interim data, rather than updating your existing saved
data » ([support.microsoft.com][ms-baseline]). Conserver la génération
précédente est un conseil, jamais une contrainte du modèle.

**Synthèse MS Project** : champs figés, 11 générations (+10 partielles),
rattachement = une date automatique. Pas d'auteur, pas de motif, pas
d'autorisation. C'est le modèle « champs figés côte à côte » à l'état
pur, et il est *muet sur le pourquoi*.

---

## 2. PMBOK / contrôle des changements — l'autorisation est un objet

### 2.1 Précaution d'édition, exigée par la question

Les deux éditions ne portent pas le même vocabulaire, et la confusion
serait fatale ici.

La **7e édition** est fondée sur des principes et des domaines de
performance. La FAQ publique de PMI est explicite : « The Process
Groups and ITTOs are referenced throughout the Seventh Edition but are
no longer fully included in the publication – we will continue to make
them available through digital offerings, like PMIstandards+ », et
« The PMBOK Guide® – Seventh Edition has expanded the breadth of tools
listed in a new section titled "Models, Methods, and Artifacts" »
([pmi.org][pmi-faq7]). Autrement dit, le vocabulaire ITTO
« approved change request » comme *sortie* d'un processus n'est plus
porté par la 7e édition sous cette forme.

Le langage « approved change request / CCB » se lit donc en **6e
édition**. C'est là qu'il faut le citer.

### 2.2 Le vocabulaire normatif : baseline = version *approuvée*

Le *Lexicon* PMI v4.0 (2024) — vocabulaire transverse à toutes les
normes PMI — définit :

- **baseline** : « The approved version of a work product that can be
  changed using formal change control procedures and is used as the
  basis for comparison to actual results. »
- **schedule baseline** : « The approved version of a schedule model
  that can be changed using formal change control procedures and is
  used as the basis for comparison to actual results. »
- **change control** : « A process whereby modifications to documents,
  deliverables, or baselines associated with the project are
  identified, documented, approved, or rejected. »
- **change control board (CCB)** : « A formally chartered group
  responsible for reviewing, evaluating, approving, delaying, or
  rejecting changes to the project, and for recording and
  communicating such decisions. »
- **change request** : « A formal proposal to modify a document,
  deliverable, or baseline. »
- **variance analysis** : « A technique for determining the cause and
  degree of difference between the baseline and actual performance. »

([PMI Lexicon v4.0][pmi-lexicon], récupéré sur miroir — voir §0.)

Deux absences vérifiées dans ce même *Lexicon* v4.0, et elles comptent :
**« change log » n'y figure pas**, et **« rebaseline » / « re-baseline »
non plus**. Le vocabulaire normatif PMI définit l'*acte* (change
control), l'*organe* (CCB), la *demande* (change request) et l'*état*
(baseline = version approuvée) — mais ne nomme ni le registre qui
enregistre l'approbation, ni l'opération de re-référencement.

Retenir : chez PMI, « baseline » n'est pas « une photo à un instant t ».
C'est « la version **approuvée** ». L'approbation est constitutive de
la définition, pas un ornement de processus.

### 2.3 Axes 1 à 3 pour PMBOK 6e édition

Le PDF d'errata publié par PMI pour la 6e édition (5e tirage) joint
les pages corrigées, et contient donc le texte réel de §4.6
([pmi.org][pmi-errata6]). On y lit :

> **4.6 PERFORM INTEGRATED CHANGE CONTROL**
> Perform Integrated Change Control is the process of reviewing all
> change requests; approving changes and managing changes to
> deliverables, project documents, and the project management plan;
> and communicating the decisions.

**Axe 1 — entité distincte, sans hésitation.** Les baselines (scope,
schedule, cost) sont des *composants du project management plan*,
listés comme entrées de 4.6 : « Schedule baseline. Described in
Section 6.5.3.1. The schedule baseline is used to assess the impact of
the changes in the project schedule. » Ce sont des documents
approuvés, pas des colonnes.

**Axe 2 — non spécifié.** Le nombre de générations conservées n'est
pas normé. Le modèle décrit une baseline *courante* que le change
control peut modifier ; l'historique des générations relève de
l'archivage documentaire, hors modèle.

**Axe 3 — modélisé, et c'est le point décisif.** L'autorisation est un
**objet du modèle**, à deux endroits :

1. **`Approved change requests`** est la sortie `.1` de 4.6 dans la
   figure 4-12, et devient une *entrée* de 4.3 Direct and Manage
   Project Work, 8.3 Control Quality et 12.3 Control Procurements
   (figure 4-13). C'est un enregistrement qui circule, pas un état
   d'esprit.
2. **`Change log`** est un *project document*, à la fois entrée et
   sortie de 4.6 : « Change log. […] The change log is used to record
   all submitted change requests. » La figure 4-12 le donne comme la
   seule ligne de `.3 Project documents updates`.

Deux détails renforcent la lecture. D'abord, l'errata PMI lui-même
*ajoute* le change log là où il manquait — « Section 4.6.1.2. Added
following bullet under Project documents: ● Change log. Described in
Section 4.6.3.3. The change log is used to record all submitted change
requests. », et « Figure 4-12. Added bullet under .2 Project documents
for Change log. » PMI a donc corrigé sa propre norme pour rendre le
registre d'autorisation *explicitement présent* dans le modèle.
Ensuite, §4.6.1.1 précise que « The change management plan […]
documents the roles and responsibilities of the change control board
(CCB) » — le CCB est nommé et ses responsabilités sont contractualisées
dans un artefact.

*Non vérifié sur primaire* : la prose de §4.6.3 (description détaillée
des sorties) ne figure pas dans les pages jointes à l'errata. Les
schémas 4-12 / 4-13 et §4.6.1 suffisent toutefois à établir le point.

*Confiance moyenne, sources secondaires uniquement* : en 7e édition,
la section « Models, Methods, and Artifacts » classerait les artefacts
en catégories dont « Logs and registers » (contenant le change log) et
« Baselines » (contenant scope baseline, project schedule, budget,
performance measurement baseline). Si cela se confirme, la 7e édition
conserve donc *les deux objets* — le registre et la référence — comme
artefacts distincts, mais sans le graphe ITTO qui les reliait.

**Synthèse PMBOK** : entité distincte ; générations non normées ;
rattachement **modélisé** — une demande de changement approuvée, un
registre qui l'enregistre, un organe formellement mandaté. C'est la
seule des trois familles de sources qui répond à « pourquoi la
référence a changé », et elle y répond par un **enregistrement séparé**,
jamais par un champ sur l'objet re-référencé.

---

## 3. Modèles de données ouverts

### 3.1 MPXJ — le format d'échange qui doit accommoder les deux modèles

MPXJ lit MS Project, Primavera P6, Asta Powerproject, GanttProject et
une vingtaine d'autres formats. Il est donc le seul endroit où les
deux branches de la fourche cohabitent dans un même modèle objet — ce
qui en fait la source la plus utile du dossier.

**Axe 1 — les deux, simultanément.** MPXJ pose le constat que MS
Project est l'exception :

> « The approach taken by Microsoft Project to managing baselines is
> unusual: most other scheduling applications take an approach similar
> to that used by Primavera P6, which is to take a complete copy of
> the schedule at the point a baseline is made, and thus any part of
> the baseline schedule is available in future to be compared with the
> current schedule. » ([mpxj.org][mpxj-baselines])

Concrètement, une baseline est un `ProjectFile` entier :
`ProjectFile.setBaseline(ProjectFile baseline, int index)` — « Store
the supplied project as baselineN […] Passing an index of 0 populates
the default baseline. Indexes 1 to 10 populate baselines 1-10. » ;
`Map<Integer, ProjectFile> getBaselines()` ; `clearBaseline(int)`
([mpxj.org][mpxj-projectfile]). Et depuis la tâche courante,
`Task.getBaselineTask()` donne accès à la tâche de référence :
« You are not then restricted by the baseline attributes provided by
MPXJ, instead you can compare the two tasks in any way you choose. »
([mpxj.org][mpxj-baselines])

Mais MPXJ *aplatit* systématiquement l'objet distinct en champs figés
sur la tâche : « when working with applications which store baselines
as separate copies of the main schedule, MPXJ populates a set of
baseline attributes on the Task class […] This aligns with how
Microsoft Project works. » Les accesseurs `getBaselineStart()`,
`getBaselineFinish()`, `getBaselineDuration()`, `getBaselineWork()`,
`getBaselineCost()` et leurs variantes indexées `(int
baselineNumber)` existent dans les deux cas
([mpxj.org][mpxj-task]).

Le prix de cet aplatissement est visible et il est instructif :
l'interface `BaselineStrategy` n'existe que pour résoudre le
**problème d'appariement** entre la tâche courante et la tâche de
référence. Trois implémentations : `DefaultBaselineStrategy` (par
GUID), `AstaBaselineStrategy` (par Unique ID),
`PrimaveraBaselineStrategy` (par Activity ID, avec deux variantes
`PLANNED_ATTRIBUTES` / `CURRENT_ATTRIBUTES` selon un réglage P6
« Earned Value Calculation » qui, lui, « is NOT available in either
PMXML or XER files exported from P6 »)
([mpxj.org][mpxj-baselines]). Autrement dit : dès que la référence est
un objet séparé, il faut un identifiant stable et une convention de
correspondance, et l'absence de l'un ou de l'autre coûte cher.

**Axe 2 — 11, par alignement, pas par nécessité.** « MPXJ will
actually allow you to explicitly attach up to 11 baseline projects to
a main project. […] The limit of 11 attached baselines follows
Microsoft Project's data model which allows up to 11 baselines to be
recorded. » ([mpxj.org][mpxj-baselines]) Côté P6, le modèle est
différent : « P6 recognizes four distinct baseline types: the Project
Baseline, and the Primary, Secondary and Tertiary User Baselines. »

**Axe 3 — une date, dérivée de l'objet.** `ProjectProperties` expose
`getBaselineDate()` et `getBaselineDate(int baselineNumber)`, ainsi
que `getLastBaselineUpdateDate()` et `getBaselineForEarnedValue()`
([mpxj.org][mpxj-props]). Et le mécanisme de rattachement est
révélateur : quand MPXJ relie une baseline P6 ou Asta à son projet, il
« will set the default baseline date in the main project to the
**baseline project's create date** » ([mpxj.org][mpxj-baselines]).
La date n'est pas une métadonnée ajoutée à la référence : c'est la
date de naissance de l'objet référence. Un objet distinct *porte
naturellement sa propre date* ; un jeu de champs figés doit se la
faire attribuer.

Aucun auteur, aucun motif, aucune décision, nulle part dans le modèle
MPXJ — sur aucun des formats lus.

Deux détails P6 pertinents pour la contrainte (a) de PKF : la baseline
« is not visible as a normal project in P6 so you can't view or […]
export it » sans la « restaurer » ; et « the User Baselines are not
visible outside of P6, i.e. information about which baselines are
assigned as user baselines does not appear in either PMXML or XER
files exported from P6 ». Un objet distinct mal exposé devient
illisible hors de l'outil — exactement le risque que PKF cherche à
éviter.

À l'inverse, Asta Powerproject « takes the same approach as P6 […] an
entire copy of the schedule is made. This copy can either be held as a
separate file, or can be embedded within the main schedule file » —
c'est l'analogue direct de « le bundle doit porter sa propre
référence ».

### 3.2 GanttProject — objet distinct, embarqué, nommé, non daté

Le format `.gan` est du XML documenté par le code. Le sérialiseur
`HistorySaver` écrit un élément enveloppe `<previous>` contenant
autant d'éléments `<previous-tasks name="…">` que de baselines, chacun
contenant des `<previous-task id start duration meeting super/>`
([HistorySaver.java][gp-saver]). Le schéma est confirmé par les
classes de données Kotlin ([XmlSerializer.kt][gp-schema]) :

```kotlin
data class XmlBaselineList(
  @get:JacksonXmlProperty(localName = "previous-tasks")
  var baselines: List<XmlBaseline> = emptyList()
) {
  data class XmlBaseline(
    @get:JacksonXmlProperty(isAttribute = true) var name: String = "",
    var tasks: List<XmlBaselineTask>? = null
  )
  data class XmlBaselineTask(
    var id: Int = 0, var startDate: String = "", var duration: Int = 0,
    var isMilestone: Boolean = false, var isSummaryTask: Boolean = false
  )
}
```

**Axe 1 — entité distincte**, portée par la classe métier
`GanttPreviousState(String name, List<GanttPreviousStateTask> tasks)`
([GanttPreviousState.java][gp-state]) — mais **embarquée dans le
fichier de projet lui-même**, pas dans un fichier séparé. Le projet
`.gan` est autoportant.

**Axe 2 — non borné.** `List<XmlBaseline>` : autant de générations que
l'utilisateur en crée. Contraste net avec la limite dure de 11 chez
Microsoft. C'est le bénéfice structurel de l'objet distinct : ajouter
une génération n'ajoute aucun champ au schéma.

**Axe 3 — un nom libre, et rien d'autre.** L'unique attribut de
`XmlBaseline` est `name: String`. Pas de date, pas d'auteur, pas de
motif, pas de lien vers une décision. Le parseur ne lit que ce nom
([PreviousStateTasksTagHandler.java][gp-parser]). La datation de la
référence dépend entièrement de ce que l'utilisateur a tapé dans le
champ de nom — la métadonnée est reléguée dans une chaîne libre.

Noter enfin ce qui est figé : `start`, `duration`, `meeting`
(jalon), `super` (tâche récapitulative). **Pas de charge, pas de
coût.** GanttProject baseline le *délai*, pas l'*effort*.

### 3.3 OpenProject — résultat négatif : la référence est une requête

L'hypothèse du brief se confirme, et c'est le résultat le plus utile
des trois modèles ouverts.

OpenProject n'a **pas d'entité baseline**. Il n'existe aucun endpoint
`/api/v3/baselines`. La comparaison se demande par un paramètre de
requête sur l'endpoint existant :

> « The work-packages API supports a `timestamps` parameter to gather
> information about a single work package or a collection of work
> packages for several points in time. »
> ([openproject.org][op-api])

Exemple documenté :
`GET /api/v3/work_packages?timestamps=2022-01-01T00:00:00Z,PT0S`.
Le premier horodatage est la référence, le dernier l'état courant. La
réponse porte une section `_meta` contenant `timestamp`,
`attributesByTimestamp`, `matchesFilters` et `exists`, et « only
attributes that differ from the ones in the main work-package object
are included in the `attributesByTimestamp` ».

Côté interface, les options sont temporelles, pas nominatives :
« Yesterday » en édition communautaire ; « last working day », « last
week », « last month », une date fixe passée, ou un intervalle entre
deux dates, en édition Enterprise ([openproject.org][op-guide]). Les
valeurs de plus d'un jour requièrent un jeton Enterprise.

**Axe 1** — ni champs ni entité : une *requête sur le journal
d'historique*. **Axe 2** — sans objet ; toutes les générations sont
implicitement disponibles, aucune n'est distinguée. **Axe 3** — rien :
aucune baseline nommée ou approuvée, aucun auteur, aucun motif.

Ce n'est pas seulement un négatif : c'est une **troisième branche**
de la fourche, « la référence est une lecture de l'historique ». Et
c'est précisément la branche que la contrainte (a) de PKF interdit —
« Git ne fait pas foi, l'écart doit être lisible en ouvrant le
fichier, sans `git blame` » est mot pour mot le refus de ce modèle.
Que la fonctionnalité soit en outre bridée derrière une licence
au-delà de 24 h illustre le second défaut du modèle : la référence
n'a de valeur que si le journal est intégralement conservé et
librement interrogeable.

---

## 4. Tableau de mise en regard

| Source | Axe 1 — champs ou entité ? | Axe 2 — générations | Axe 3 — rattachement |
|---|---|---|---|
| **MS Project** | Champs figés sur la tâche ; aucune entité baseline (`getBaselineTask()` toujours nul sur MPP) | 11 jeux complets (`Baseline`, `Baseline 1..10`) + 10 plans intermédiaires (dates seules) | Une date automatique par génération, au niveau projet (`BaselineSavedDate`, lecture seule). Aucun auteur, motif ni libellé — `BaselineSave()` n'a aucun paramètre pour cela |
| **Primavera P6** (via MPXJ) | Entité : copie complète du planning, invisible tant qu'elle n'est pas « restaurée » | 4 emplacements typés : Project Baseline + User Baselines primaire / secondaire / tertiaire | La date vient du `create date` de l'objet baseline. L'affectation des User Baselines n'est pas exportée en PMXML/XER |
| **Asta Powerproject** (via MPXJ) | Entité : copie complète, **fichier séparé ou embarqué** dans le planning | Non instruit (MPXJ ne lit que la baseline courante) | `create date` de l'objet baseline |
| **PMBOK 6e éd.** | Entité : la baseline est un composant approuvé du *project management plan* | Non normé (une baseline courante ; l'historique relève de l'archivage) | **Modélisé** : `approved change requests` (sortie de 4.6, entrée de 4.3/8.3/12.3) + `change log` (document projet, toujours mis à jour) + CCB mandaté par le change management plan |
| **PMBOK 7e éd.** | Artefacts de catégorie « Baselines » *(secondaire, non vérifié)* | Non normé | `change log` en catégorie « Logs and registers » *(secondaire, non vérifié)* ; plus de graphe ITTO |
| **MPXJ** | **Les deux** : `ProjectFile` de référence attaché, *et* aplatissement en champs `Baseline*` sur `Task` | 11 (`getBaselines()` → `Map<Integer, ProjectFile>`), par alignement sur MS Project | `getBaselineDate(int)`, `getLastBaselineUpdateDate()` ; la date par défaut est le `create date` du projet de référence. Aucun auteur ni motif |
| **GanttProject** | Entité `<previous-tasks>`, **embarquée dans le `.gan`** | Non borné (`List<XmlBaseline>`) | Un attribut `name` en texte libre. Ni date, ni auteur, ni motif |
| **OpenProject** | **Ni l'un ni l'autre** : requête `timestamps` sur le journal | Sans objet (tout l'historique, rien de distingué) | Aucun. Options purement temporelles ; > 24 h derrière licence Enterprise |

Trois lectures transversales du tableau :

1. **MS Project est l'exception, pas la règle.** MPXJ le dit
   explicitement ; P6, Asta et GanttProject convergent tous vers
   l'entité distincte.
2. **Aucun outil de planification n'enregistre le *pourquoi*.** Au
   mieux une date (MS Project, P6, Asta), au pire un nom libre
   (GanttProject) ou rien (OpenProject). La seule source qui modélise
   l'autorisation est PMBOK — et elle la modélise comme un
   enregistrement séparé.
3. **La charge n'est baselinée que là où elle existe déjà sur la
   tâche.** MS Project et P6 figent `Work` parce que `Work` est un
   champ de tâche. GanttProject, qui n'a pas de charge, ne fige que
   `start` et `duration`.

---

## 5. Ce que chaque option coûte et rapporte à PKF

PKF reste volontairement **au-dessus** de l'outil de planification :
agrégat de pilotage, jamais la tâche (§1 Non-goals : « Replacing
established project management tools (Jira, Azure DevOps, Microsoft
Project) — PKF standardizes the knowledge layer beneath them »). Deux
contraintes bornent la réponse : **(a)** le bundle porte sa propre
référence, Git ne fait pas foi ; **(b)** jamais de champs de référence
sur `Action`.

### 5.0 Ce que les sources retirent d'emblée de la table

La branche **« référence = lecture de l'historique »** (OpenProject)
est éliminée par la contrainte (a), sans discussion. Il faut le dire
explicitement, parce que c'est la branche vers laquelle un format
versionné dans Git glisse naturellement : « on a `git log`, pourquoi
stocker la référence ? ». OpenProject montre où mène cette pente —
une référence qui n'existe qu'en tant que requête, non nommée, non
motivée, et dont l'accès finit par dépendre de la rétention du
journal.

Le corollaire vaut pour les deux branches restantes : la référence
doit être **écrite dans un fichier du bundle**, quelle que soit
l'option retenue.

Second acquis transversal, valable dans les deux branches :
**l'écart lui-même ne doit pas être stocké, il doit être dérivé.**
MS Project ne stocke ni `Start Variance` ni `Work Variance` : `Entry
Type: Calculated`, formule documentée. PKF traite déjà de la même
façon les champs dérivés — `Risk.score` est calculé (Appendix B), et
§11 prévoit qu'un outil de validation vérifie qu'un champ dérivé
« match[es] their computation […] rather than a stale hand-authored
value ». Un champ `delay_days` écrit à la main serait un
`Risk.score` périmé de plus. La fourche porte donc sur *où vit la
référence*, pas sur *où vit l'écart*.

### 5.1 Option A — champs figés côte à côte sur `Milestone` / `Project`

*Par exemple `baseline_due_date` à côté de `due_date` sur `Milestone`.*

**Ce que ça rapporte.**

- **Lisibilité brute maximale**, et c'est un principe fondateur de PKF
  (§2 « un fichier PKF fait sens à la lecture brute »). Ouvrir
  `m003-recette.md` montre la référence et la date courante dans le
  même bloc frontmatter : l'écart se lit d'un coup d'œil, sans
  résoudre une relation, sans ouvrir un second fichier, sans outil.
  C'est très exactement ce que la contrainte (a) demande, et c'est le
  seul argument vraiment fort de cette branche.
- **Coût de schéma quasi nul si une seule génération suffit.** La
  contrainte (b) change tout par rapport à MS Project : l'explosion à
  176 constantes vient de ce que MS Project baseline *chaque tâche* ;
  au niveau `Milestone` + `Project` uniquement, une génération, c'est
  deux à quatre champs optionnels. Il ne faut pas laisser la
  complexité apparente de MS Project contaminer le jugement — elle
  n'est pas transposable ici.
- **Aucun problème d'appariement.** `BaselineStrategy` chez MPXJ
  n'existe que pour rattacher une tâche courante à sa tâche de
  référence (GUID, Unique ID, Activity ID). En option A la question ne
  se pose pas : la référence est dans le même fichier.
- **Reste clairement du côté « une colonne de plus »**, donc à
  distance du non-goal « remplacer MS Project ».

**Ce que ça coûte.**

- **Ne monte pas en générations.** C'est le point de rupture. Deux
  générations, et il faut `baseline_due_date_1`,
  `baseline_due_date_2` — la voie qui produit `BASELINE1_START` …
  `BASELINE10_START`, transposée à l'agrégat. Le mécanisme MS Project
  des *interim plans* (dates seules, 10 emplacements) est l'aveu que
  cette voie est trop chère dès qu'on la répète.
- **La référence figée est modifiable et indiscernable d'une faute de
  frappe.** MS Project documente ses champs baseline comme
  « Calculated or entered », et MPXJ le dit : « no recalculation takes
  place if they are edited ». Un champ ordinaire de frontmatter, dans
  un fichier édité à la main par des humains et des agents, n'a aucune
  protection. Rien dans le fichier ne distingue « référence figée en
  mars » de « quelqu'un a corrigé la valeur hier ».
- **Il faut inventer le rattachement, aucune source ne le fournit.**
  MS Project attache une date, et c'est une propriété *de projet*
  indexée par numéro de baseline — pas un champ de tâche. Transposée,
  cette date devient un champ de plus (`baseline_set_date`), puis un
  troisième si l'on veut le motif, puis un quatrième pour la
  `Decision`. Le rattachement est ce qui fait dégénérer l'option A :
  chaque métadonnée de la référence est un champ supplémentaire sur
  un objet dont ce n'est pas le sujet.

### 5.2 Option B — objet de replanification distinct et daté

*Par exemple un type `Replan` / `Baseline`, relié au `Milestone` ou au
`Project`, portant la date, l'auteur et la référence gelée.*

**Ce que ça rapporte.**

- **C'est le modèle majoritaire de l'art antérieur**, MPXJ le dit sans
  détour : MS Project est « unusual », la plupart des autres outils
  font comme P6. GanttProject, P6 et Asta convergent.
- **Les générations sont gratuites.** `List<XmlBaseline>` chez
  GanttProject n'est bornée par rien ; ajouter une génération n'ajoute
  aucun champ au schéma. Chez PKF cela signifie : un fichier de plus
  dans un répertoire, exactement comme un risque ou une action de
  plus. Le format sait déjà faire.
- **L'objet porte naturellement sa propre datation.** C'est le détail
  le plus parlant de MPXJ : la date de baseline par défaut est le
  `create date` *du projet de référence*. Un objet a une date parce
  qu'il est un objet ; un champ figé doit se voir attribuer la sienne.
- **C'est la seule branche compatible avec l'axe 3 de PMBOK.**
  L'autorisation y est un enregistrement — `approved change request`
  circulant en sortie de 4.6, `change log` mis à jour à chaque fois —
  jamais un champ sur l'objet re-référencé. Et PKF est le seul des
  formats examinés à posséder *déjà* l'objet correspondant :
  `Decision` porte `decision_date`, `decision_maker`, `rationale`,
  `impact_description`, un statut `Superseded` et une relation
  `superseded_by` → `Decision`. La chaîne de générations que P6 et
  MS Project encodent par un numéro d'emplacement, PKF sait déjà
  l'exprimer par `supersedes` / `superseded_by`. §10 nomme même
  `ChangeRequest` comme exemple canonique de type d'extension — c'est
  littéralement l'artefact PMBOK.
- **Immuabilité par convention.** Un fichier daté qu'on n'édite plus
  est une référence beaucoup plus crédible qu'un champ voisin de la
  valeur courante dans le même bloc YAML.

**Ce que ça coûte.**

- **La lecture brute se dégrade, et c'est le coût réel.** Ouvrir
  `m003-recette.md` ne montre plus que la date courante. Savoir s'il y
  a écart demande de résoudre une relation. Cela heurte le principe
  §2. La mitigation existe dans le format — relation inverse (§7.1),
  ou `View` générée (§3, §1 Goals point 4 : « le risk register devient
  une vue générée ») — mais elle a un prix : *l'écart devient une
  chose qu'on calcule, plus une chose qu'on lit*. C'est acceptable si
  l'on assume que l'écart est de toute façon un dérivé (§5.0), et
  gênant si l'on veut qu'un humain ouvrant un fichier voie le retard.
- **Risque d'invisibilité hors outil**, dont P6 fournit le
  contre-exemple : la baseline « is not visible as a normal project in
  P6 » et l'affectation des User Baselines « does not appear in either
  PMXML or XER files ». Un objet distinct mal exposé est un objet
  perdu. La parade est celle d'Asta — « embed the baseline in the
  file » — et celle de GanttProject : la référence vit *dans* le
  fichier de projet. Transposé à PKF : les objets de replanification
  doivent être des fichiers ordinaires du bundle, pas un artefact
  annexe.
- **Le rattachement à l'agrégat doit être choisi.** Un objet de
  replanification par `Milestone`, ou un objet par exercice de
  replanification portant plusieurs jalons (ce que font tous les
  outils : on baseline le *plan*, pas un jalon) ? Le second est plus
  fidèle à l'art antérieur et plus économe en fichiers ; le premier se
  lit mieux depuis le jalon.
- **Frontière du non-goal.** Un type dont la granularité est *le plan*
  se rapproche visuellement d'un outil de planification. L'argument
  est cependant faible : l'objet ne contiendrait que des dates et des
  charges d'agrégats, jamais de tâches, et §10 anticipe déjà ce genre
  d'extension.

### 5.3 Le fait qui tranche

**Combien de générations de référence PKF doit-il conserver ?**

- **Une seule** (le plan initial, jamais rejoué) → l'option A gagne
  nettement : deux champs, lisibilité maximale, aucun coût structurel,
  et le rattachement peut se réduire à une relation
  `baseline_decision` → `Decision` si l'on veut le pourquoi.
- **Deux ou plus** → l'option A dégénère en `baseline_*_1..n`, c'est
  la trajectoire documentée de MS Project et de MPXJ, et l'option B
  devient la seule qui ne fasse pas grossir le schéma.

Le second discriminant, subordonné au premier :

**PKF veut-il enregistrer *pourquoi* la référence a changé ?** Si oui,
aucun outil de planification ne fournit de modèle — il faut aller
chercher PMBOK, et PMBOK répond « un enregistrement séparé ». Un champ
`rebaseline_reason` sur `Milestone` n'a aucun antécédent dans les
sources ; une `Decision` reliée en a un, direct et normatif.

Une position intermédiaire mérite d'être posée sur la table de la
fourche, parce qu'elle n'est pas une esquive : **A pour la valeur, B
pour le motif** — champs figés d'une seule génération sur
`Milestone` / `Project` (lisibilité brute préservée), plus une
relation vers la `Decision` qui a autorisé le re-référencement (axe 3
satisfait par un objet qui existe déjà, sans nouveau type). Cette
combinaison ne survit toutefois que si la réponse au premier
discriminant est « une seule génération ». Elle ne résout pas la
question des générations, elle la reporte.

---

## 6. Angles morts

- **La charge n'existe nulle part dans PKF aujourd'hui.** Ni `Action`
  ni `Milestone` ne portent d'estimation en jours·homme (§6). MS
  Project et P6 baselinent `Work` parce que `Work` est un champ de
  tâche ; GanttProject, qui n'a pas de charge, ne baseline que les
  dates. La recherche ne dit pas d'où viendrait la *charge de
  référence* d'un `Milestone` — agrégation des `Action` rattachées
  (mais la contrainte (b) interdit d'y mettre des champs de
  référence), ou saisie directe sur l'agrégat ? **C'est un préalable à
  la fourche, pas une conséquence** : les deux options sont également
  bloquées tant qu'il n'y a rien à figer.
- **Aucune source ne baseline un agrégat isolément.** Les trois outils
  baselinent le plan entier, ou une sélection de tâches. Baseliner un
  `Milestone` seul, ou un `Project` seul, n'a pas d'art antérieur
  direct. La transposition est une extrapolation, dans les deux
  branches.
- **Sur primaire, il manque** : la prose de §4.6.3 du PMBOK 6e éd.
  (outputs), la taxonomie des artefacts du PMBOK 7e éd., et la
  documentation Oracle sur P6 (lu uniquement via MPXJ). Le *Practice
  Standard for Scheduling* de PMI, probable détenteur de la mécanique
  réelle de re-baseline, n'a pas été atteint.
- **Cycle de vie de l'écart non instruit.** Quand un `Milestone` passe
  à `Achieved`, l'écart se fige-t-il, se recalcule-t-il, disparaît-il ?
  Aucune source consultée ne le traite. C'est pourtant décisif pour un
  format dont la vocation est le reporting de pilotage.
- **Effet sur `Delivery` non instruit.** `Delivery` porte
  `release_date` et une relation `milestone` (0..1). Si l'écart vit
  sur `Milestone`, une `Delivery` glissée sans jalon rattaché est
  invisible. La question n'était pas dans le périmètre, mais elle
  suivra immédiatement.
- **Conformance (§11).** Quelle que soit l'option, il faudra dire
  explicitement dans §11 comment un validateur traite une référence :
  vérification de dérivation pour l'écart (comme `Risk.score`), et —
  en option A — l'absence de tout mécanisme empêchant l'édition
  silencieuse d'un champ figé reste un trou que le format ne sait pas
  boucher.

---

## 7. Sources

Toutes les URL ci-dessous ont été effectivement récupérées, sauf
mention contraire.

[ms-baseline]: https://support.microsoft.com/en-us/office/create-or-update-a-baseline-or-an-interim-plan-in-project-desktop-7e775482-ac84-4f4a-bbd0-592f9ac91953
[ms-bl1-10-start]: https://support.microsoft.com/en-us/office/baseline1-10-start-fields-6cd8e7c2-6964-4b05-a35c-4abeb2d10f8e
[ms-start-var]: https://support.microsoft.com/en-us/office/start-variance-fields-0d8ac113-d0d6-4577-892b-893acb66a028
[ms-work-var]: https://support.microsoft.com/en-us/office/work-variance-fields-1bb45242-e32e-4c7f-a694-81bc2a9e9a74
[ms-vba-bsd]: https://learn.microsoft.com/en-us/office/vba/api/project.project.baselinesaveddate
[ms-vba-bs]: https://learn.microsoft.com/en-us/office/vba/api/project.application.baselinesave
[pmi-lexicon]: https://www.coloradocollege.edu/offices/its/pmi-lexicon-pm-terms-compressed.pdf
[pmi-errata6]: https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pmbok-guide-6th-edition-5th-printing.pdf
[pmi-faq7]: https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pmbok-guide-public-faqs-1-july-2021.pdf
[mpxj-baselines]: https://www.mpxj.org/howto-use-baselines/
[mpxj-task]: https://www.mpxj.org/apidocs/org/mpxj/Task.html
[mpxj-props]: https://www.mpxj.org/apidocs/org/mpxj/ProjectProperties.html
[mpxj-projectfile]: https://www.mpxj.org/apidocs/org/mpxj/ProjectFile.html
[mpxj-taskfield]: https://www.mpxj.org/apidocs/org/mpxj/TaskField.html
[gp-saver]: https://raw.githubusercontent.com/bardsoftware/ganttproject/master/ganttproject/src/main/java/net/sourceforge/ganttproject/io/HistorySaver.java
[gp-parser]: https://raw.githubusercontent.com/bardsoftware/ganttproject/master/ganttproject/src/main/java/net/sourceforge/ganttproject/parser/PreviousStateTasksTagHandler.java
[gp-state]: https://raw.githubusercontent.com/bardsoftware/ganttproject/master/ganttproject/src/main/java/net/sourceforge/ganttproject/GanttPreviousState.java
[gp-schema]: https://raw.githubusercontent.com/bardsoftware/ganttproject/master/biz.ganttproject.core/src/main/java/biz/ganttproject/core/io/XmlSerializer.kt
[op-api]: https://www.openproject.org/docs/api/baseline-comparisons/
[op-guide]: https://www.openproject.org/docs/user-guide/work-packages/baseline-comparison/

**Microsoft Project**

- [Create or update a baseline or an interim plan in Project desktop][ms-baseline]
- [Baseline1-10 Start fields][ms-bl1-10-start]
- [Start Variance fields][ms-start-var]
- [Work Variance fields][ms-work-var]
- [Project.BaselineSavedDate property (VBA)][ms-vba-bsd]
- [Application.BaselineSave method (VBA)][ms-vba-bs]

**PMI**

- [ERRATA — PMBOK Guide Sixth Edition, Fifth Printing][pmi-errata6] —
  PDF public hébergé par PMI, joint les pages corrigées 113, 114, 116
  (§4.6 Perform Integrated Change Control).
- [PMBOK Guide Seventh Edition FAQs, 30 août 2021][pmi-faq7] — PDF
  public hébergé par PMI.
- [PMI Lexicon of Project Management Terms, Version 4.0 (2024)][pmi-lexicon]
  — **récupéré sur un miroir universitaire** ; l'URL officielle
  `pmi.org/-/media/pmi/documents/registered/pdf/pmbok-standards/pmi-lexicon-pm-terms.pdf`
  renvoie un HTTP 403. Le PDF s'auto-identifie comme la publication
  PMI v4.0, ©2024 PMI.

**MPXJ** (bibliothèque d'échange lisant MPP/MSPDI, P6 XER/PMXML, Asta,
GanttProject…)

- [How To: Use Baselines][mpxj-baselines]
- [javadoc `Task`][mpxj-task] · [`ProjectProperties`][mpxj-props] ·
  [`ProjectFile`][mpxj-projectfile] · [`TaskField`][mpxj-taskfield]

**GanttProject** (code source, branche `master`)

- [`HistorySaver.java`][gp-saver] · [`PreviousStateTasksTagHandler.java`][gp-parser]
- [`GanttPreviousState.java`][gp-state] · [`XmlSerializer.kt`][gp-schema]

**OpenProject**

- [API: Baseline Comparisons][op-api]
- [Guide utilisateur : Baseline comparison][op-guide]

**Dans ce dépôt**

- `skills/pkf/specs/PKF_SPEC.md` — §1 Goals/Non-goals, §2 Principes,
  §3 Terminologie, §3.1 grammaire des ID, §6 (`Action`, `Decision`,
  `Delivery`, `Milestone`, `Project`), §7.1 relations inverses, §10
  extensibilité, §11 conformance, Appendix B (`Risk.score` dérivé).
