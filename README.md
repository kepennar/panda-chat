# Panda Chat

## Contexte

Ce projet a pour but de définir une stack efficace pour développer rapidement des applications web modernes et réactive

### Problèmatique initiale

1.  Expérimenter Tailwindcss afin de me faire mon propre avis
2.  Monter en compétence sur la stack firebase (Firestore, Cloud-functions)
3.  Garantir que les données en provenance de Firestore sont cohérente avec le typing Typescript en utilisant une validation des données au runtime

## En pratique

### 1) Tailwindcss

En associant Tailwindcss et le plugin `Tailwind CSS IntelliSense`, le dévelopmenent des layouts/composants et rapide malgrès une impression d'avancer dans le flou du fait de la non-connaissance de l'outil.

L'utilisation de `PurgeCSS` permet d'obtenir une feuille de style super optimisé en supprimant tout le CSS inutilisé

Cependant au bout de quelques heures de dévelopmenent je suis confronté à une dificulté à faire évoluer mes composants en raison du nombre très importants de classes CSS utilisées

```jsx
<input
  value={password}
  onChange={(event) => setPassword(event.target.value)}
  className={classnames(
    "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    {
      "text-gray-700": !submitted || password,
      "border-red-500": submitted && !password,
    }
  )}
  id="password"
  type="password"
  placeholder="******************"
/>
```

Le confort du CSS-in-JS auquel je m'étais récement habitué via l'utilisation des `styled-component` et de `emotion` me manque.

Je réfléchis à une alternative et envisage de migrer vers `https://rebassjs.org/`

### 2) Firestore

Je trouve très agréable d'utiliser Firestore et de pousser au maximum l'utilisation du temps réel via `onSnapshot`.

Cependant selon l'utilisation, cela provoque un nombre de lectures très important de lecture. Les Quotas peuvent être très rapidement atteint pour ensuite passer à une facturation `$0.039 pour 100 000 documents lus`. Je réfléchis à une optimisation permettant de mutualiser lers lectures entre les composants. D'abord en mettant en place une solution naive de registre de callback. Je réflèchis maintenant à superposer une surcouche d'observabilité en utilisant `Mobx`

#### Cloud Function

L'approche "toute la logique dans le front" atteint rapidement ses limites. En effet je me voyais mal implémenter le système d'invitation à un chat dans l'application cliente.
Pour répondre à cette problèmatique j'ai utilisé la fonctionnalité serverless de Firebase: les clouds functions en utilisant Typescript et le module `firebase-admin`

#### Rules

Afin de garantir les authorizations d'accès et de lecture au documents. Il faudra implémenter des `Rules`

C'est très vite nécessaire de créer au moins un match par collection

Attention a bien penser implémentation des règles de sécurité dès la conception du modèle de données

Ne pas hésiter à créer des fonction de validation afin de faciliter la comprèhension des règles.

C'est finalement assez fastidieux d'écrire des règles. Principalement du fait de la difficulté à les tester. Les tests d'intègrations basés sur `@firebase/testing` ne sont pas évident à écrire et nécessite le lancement de l'emulateur

### 3) Intégrité des données

Firestore étant une base de données Document schemaless. Rien ne garanti qu'a un instant T le document lu contient tous les champs du model Typescript attendu par le code de l'application Front.

Je cherche donc une solution de validation des données au runtime afin de garantir le bon fonctionnement de l'application au Runtime.

Je commence tout d'abord par mettre en place nue validation des donnèes utilisan la specification https://json-schema.org/specification.html et l'implémentation https://github.com/epoberezkin/ajv. Cela me permet dde couvrir l'ensemble de mes besoins mais çȧ ne me satisfait pas pour autant. En effet la définition des `json-schema` est verbeuse et me prend beaucoup de temps. D'autre par les implémentation Javascript de `json-schema` (ajv) est très lourde (117.1kB minifié). Cela alourdi trop mon bundle.

Je choisi donc d'utiliser une solution alternative moins puissante mais plus efficace et beaucoup plus legere https://github.com/ianstormtaylor/superstruct
