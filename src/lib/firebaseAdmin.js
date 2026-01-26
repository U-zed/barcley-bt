// src/lib/firebaseAdmin.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "bank-f0af4",
      clientEmail: "firebase-adminsdk-fbsvc@bank-f0af4.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2pE+gn9BcVM/P\nZcLIDgoPT++64yDmd+skbUfPP1syZOa0AcMvgYsy4KzvLOvxVlleIeijHJXDaUJA\nKA8ZSqDJpwBr+L8wmKuxLufdMt0oqLyVvJNCjS9Hv6i+9BJ6fHXwwGero1eMvLSj\nS+Pn/BQWUH+GcfmL6C0Br22/Ubs6Qhwj4/9NVTWoK4mFje5hmL5z9+oCnadx4KOH\nPwJAq67KZhfxIzVJLuOiKfv/x9m9g+TFhtWwwdhzUttwsR2nn185/5rORtmMiMq9\n2/RdXwz3e6k3crgVURAPd9sv43gS7dkhgRE9PyQHFuahoRVsJzc68/fzAdKSBS5A\nP7mZ+NbzAgMBAAECggEAIYabz0JGvwwacVmenZZmJlVoDggvO977XN5qdhKNLPz0\nlEpWh9vhr18qn2TBkrVlBjB3Qam3m/0wWhKAYwYd6aYsH6WzgrojmgygJyx1CEeh\nBmNtLKQ575Ow6Axpb+50v9KxtQHwyjbBedAub6EIFuiD4Cv/wLzHti17mcjo81Jr\n8WsVh7SSFEpWHdjMXbUQX+r9gBmVLDPeCCChDzQMPbxI7XuTw2nM9yUK7Xg7EAcn\nue6Ge9x5dNTRuO0cL++Sa143a9UkLgWZUd8Z668FUckp0hIjFUJmdvmE1MIdO3z+\nvRsC8pSkDzQiC2dTTK7/jk8pR8X4zFxkxGV6aMZYUQKBgQDY4wtNHPSvzLwJk9Vr\nR2xppmx2sV5vSL23LSAG1K3MZImQIbwTZZg4Yq2C2In4nrfgySnxBDvUofAnT7xx\n0NMydTkSNu0HIwJsvlcHHCZ2+sBMqXHPKQ2naIfg3gxdaUKGdRDwNDAQWEZhq2xo\nKOp9/gdbY5Iq9xjIP9mmRYzfxQKBgQDXlEkI89qs6L+BIctcnfOuiqdMGJ5mTPM1\nTOnMkQnFP6x3Qlju7F2AoANClIMHSpY5gOPitTpbdtqgbcJiRczDXpMlgobkmm5r\ndVwSxrZqTaDwo16lQ9IehoHAOBI4dqJ3MCrW/Txj08Cz9Uho6SF62//QollMZDVH\nuXIPc49PVwKBgDBB5GPWC4OKNFSVNilWjQK86ulF8dMlBkFZowSiEcGmpQ0S1Hwk\nYMg6/IxejeRpvFQhrllYLc/T8FFu5mkUo8lYV8h7vCWYXpO/jjGgy9YxWNQ154LG\niak0EvevsGSgZRLxvUEU+5THb3GP6OEMKZC7Evv8nas9q5/yxQS/+OZZAoGAT1Pt\nnDG/oijzb100LByjcvLqpQHaJ+LhDBgFYJVudvr7R9dOSn0H2zEGghWMMb6skPRw\n5xexJb8SrD43bVoqAypmE0N4x95cC4bgHrion215b5NuXHocc8cjL8xyR/y/xAQh\nf4MoGcPuAUqdHp3LCB60f9195rJpOL9wzWbEsXkCgYARPAmYomfD7Bb3ZNaVss8i\n4BtJA1+9Y8JrPZobQ+BaHNAkBy+84iYJDtdpdqodWN3GWuopZFr/AcomXHQZ9UXZ\nEIJH/TYaRuEL2bAxOhrvDFY1horbiDmdMlYee51k+ChB87OZZoy1IPcVtU7He4/C\nP3zHa9yiZPqChNfqETzGww==\n-----END PRIVATE KEY-----\n",
    }),
  });
}

export const dbAdmin = admin.firestore();
