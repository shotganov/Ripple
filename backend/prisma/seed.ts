import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "reports", "likes", "comments", "follows", "posts", "users" RESTART IDENTITY CASCADE',
  );

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'Администратор',
      tag: 'admin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      bio: 'Главный администратор платформы',
      avatar: 'default.png',
    },
  });

  const seneca = await prisma.user.create({
    data: {
      username: 'Сенека',
      tag: 'seneca',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Римский философ-стоик',
      avatar: 'seneka.png',
    },
  });

  const epictetus = await prisma.user.create({
    data: {
      username: 'Эпиктет',
      tag: 'epictetus',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Греческий философ-стоик',
      avatar: 'epictetus.png',
    },
  });

  const caligula = await prisma.user.create({
    data: {
      username: 'Калигула',
      tag: 'caligula',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Римский император и философ',
      avatar: 'kaligula.png',
    },
  });

  const descartes = await prisma.user.create({
    data: {
      username: 'Рене Декарт',
      tag: 'descartes',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Французский философ и математик',
      avatar: 'decart.jpg',
    },
  });

  const hume = await prisma.user.create({
    data: {
      username: 'Дэвид Юм',
      tag: 'hume',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Шотландский философ-эмпирик',
      avatar: 'hume.jpg',
    },
  });

  const locke = await prisma.user.create({
    data: {
      username: 'Джон Локк',
      tag: 'locke',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Английский философ, основатель либерализма',
      avatar: 'john_lokk.jpg',
    },
  });

  const leibniz = await prisma.user.create({
    data: {
      username: 'Готфрид Лейбниц',
      tag: 'leibniz',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Немецкий философ и математик',
      avatar: 'leibniz.jpg',
    },
  });

  const machiavelli = await prisma.user.create({
    data: {
      username: 'Никколо Макиавелли',
      tag: 'machiavelli',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Итальянский мыслитель эпохи Возрождения',
      avatar: 'makiavelli.jpg',
    },
  });

  const montesquieu = await prisma.user.create({
    data: {
      username: 'Шарль Монтескье',
      tag: 'montesquieu',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Французский философ-просветитель',
      avatar: 'montesquieu.jpg',
    },
  });

  const rousseau = await prisma.user.create({
    data: {
      username: 'Жан-Жак Руссо',
      tag: 'rousseau',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Французский мыслитель эпохи Просвещения',
      avatar: 'russo.jpg',
    },
  });

  const voltaire = await prisma.user.create({
    data: {
      username: 'Вольтер',
      tag: 'voltaire',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Французский философ-просветитель и писатель',
      avatar: 'volter.jpg',
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'Пользователь',
      tag: 'user',
      role: Role.USER,
      passwordHash: hashedPassword,
      bio: 'Тестовый пользователь',
      avatar: 'default.png',
    },
  });

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: seneca.id,
        content:
          'Человек, которого застеклённые окна защищали от малейшего дуновения, подвергается смертельной опасности, даже если его коснётся самый лёгкий ветерок.',
      },
    }),
    prisma.post.create({
      data: {
        userId: seneca.id,
        content:
          'Говорят, что Гай Цезарь отличался помимо прочих немалочисленных своих пороков каким-то удивительным сладострастием в оскорблениях.',
      },
    }),
    prisma.post.create({
      data: { userId: seneca.id, content: 'Измени своё мнение, если оно ошибочно.' },
    }),
    prisma.post.create({
      data: {
        userId: epictetus.id,
        content: 'Не тот беден, кто имеет мало, а тот, кто хочет иметь больше.',
      },
    }),
    prisma.post.create({
      data: { userId: epictetus.id, content: 'Познай самого себя.' },
    }),
    prisma.post.create({
      data: {
        userId: caligula.id,
        content: 'Счастье вашей жизни зависит от качества ваших мыслей.',
      },
    }),
    prisma.post.create({
      data: {
        userId: descartes.id,
        content: 'Cogito, ergo sum. Мыслю, следовательно, существую.',
      },
    }),
    prisma.post.create({
      data: {
        userId: descartes.id,
        content:
          'Чтобы найти истину, необходимо хоть раз в жизни усомниться во всём, насколько это возможно.',
      },
    }),
    prisma.post.create({
      data: {
        userId: hume.id,
        content:
          'Привычка — великий руководитель в человеческой жизни. Только она делает наш опыт полезным.',
      },
    }),
    prisma.post.create({
      data: {
        userId: hume.id,
        content: 'Разум есть и должен быть лишь рабом страстей.',
      },
    }),
    prisma.post.create({
      data: {
        userId: locke.id,
        content:
          'Все люди по природе равны и свободны. Никто не может лишить другого жизни, здоровья, свободы или собственности.',
      },
    }),
    prisma.post.create({
      data: {
        userId: locke.id,
        content: 'Ум подобен чистому листу — опыт пишет на нём.',
      },
    }),
    prisma.post.create({
      data: {
        userId: leibniz.id,
        content: 'Мы живём в лучшем из возможных миров.',
      },
    }),
    prisma.post.create({
      data: {
        userId: leibniz.id,
        content:
          'Настоящее чревато будущим, а прошлое присутствует в настоящем.',
      },
    }),
    prisma.post.create({
      data: {
        userId: machiavelli.id,
        content:
          'Лучше, чтобы тебя боялись, чем любили — если уж нельзя совместить и то и другое.',
      },
    }),
    prisma.post.create({
      data: {
        userId: machiavelli.id,
        content: 'Цель оправдывает средства, но не всегда оправдывает того, кто их выбрал.',
      },
    }),
    prisma.post.create({
      data: {
        userId: montesquieu.id,
        content:
          'Чтобы не злоупотребляли властью, необходим такой порядок вещей, при котором различные власти могли бы взаимно сдерживать друг друга.',
      },
    }),
    prisma.post.create({
      data: {
        userId: montesquieu.id,
        content: 'Свобода есть право делать всё, что дозволено законами.',
      },
    }),
    prisma.post.create({
      data: {
        userId: rousseau.id,
        content: 'Человек рождается свободным, но повсюду он в оковах.',
      },
    }),
    prisma.post.create({
      data: {
        userId: rousseau.id,
        content:
          'Природа создала человека счастливым и добрым, но общество искажает его и делает несчастным.',
      },
    }),
    prisma.post.create({
      data: {
        userId: voltaire.id,
        content:
          'Я не согласен с тем, что вы говорите, но готов умереть за ваше право это говорить.',
      },
    }),
    prisma.post.create({
      data: {
        userId: voltaire.id,
        content: 'Здравый смысл — не такая уж распространённая вещь.',
      },
    }),
  ]);

  const [
    senecaPost1,
    senecaPost2,
    senecaPost3,
    epictetusPost1,
    epictetusPost2,
    caligulaPost1,
    descartesPost1,
    descartesPost2,
    humePost1,
    humePost2,
    lockePost1,
    lockePost2,
    leibnizPost1,
    leibnizPost2,
    machiavelliPost1,
    machiavelliPost2,
    montesquieuPost1,
    montesquieuPost2,
    rousseauPost1,
    rousseauPost2,
    voltairePost1,
    voltairePost2,
  ] = posts;

  const philosophers = [
    seneca,
    epictetus,
    caligula,
    descartes,
    hume,
    locke,
    leibniz,
    machiavelli,
    montesquieu,
    rousseau,
    voltaire,
  ];

  const likeData: { userId: number; postId: number }[] = [];
  for (const post of posts) {
    const liked = new Set<number>();
    const count = 2 + Math.floor(Math.random() * 5);
    while (liked.size < count) {
      const candidate = philosophers[Math.floor(Math.random() * philosophers.length)];
      if (candidate.id !== post.userId) liked.add(candidate.id);
    }
    liked.forEach((userId) => likeData.push({ userId, postId: post.id }));
  }
  await prisma.like.createMany({ data: likeData });

  await prisma.comment.createMany({
    data: [
      { userId: epictetus.id, postId: senecaPost1.id, content: 'Мудро сказано, друг.' },
      { userId: caligula.id, postId: senecaPost1.id, content: 'Очень актуально в наше время.' },
      { userId: descartes.id, postId: senecaPost3.id, content: 'Сомнение — путь к истине.' },
      { userId: voltaire.id, postId: senecaPost2.id, content: 'Тираны во все времена одинаковы.' },
      { userId: seneca.id, postId: epictetusPost1.id, content: 'Согласен на 100%.' },
      { userId: machiavelli.id, postId: epictetusPost1.id, content: 'Богатство — иллюзия власти.' },
      { userId: locke.id, postId: epictetusPost2.id, content: 'Самопознание начинается с опыта.' },
      { userId: rousseau.id, postId: caligulaPost1.id, content: 'Качество мыслей определяет свободу.' },
      { userId: hume.id, postId: descartesPost1.id, content: 'А существует ли это самое «я»?' },
      { userId: leibniz.id, postId: descartesPost1.id, content: 'Гениально и просто.' },
      { userId: epictetus.id, postId: descartesPost2.id, content: 'Сомнение очищает разум.' },
      { userId: locke.id, postId: humePost1.id, content: 'Опыт — источник всякого знания.' },
      { userId: descartes.id, postId: humePost2.id, content: 'Тут я с вами поспорю, Дэвид.' },
      { userId: voltaire.id, postId: lockePost1.id, content: 'Это и есть основа свободы.' },
      { userId: rousseau.id, postId: lockePost1.id, content: 'А оковы общества тогда откуда?' },
      { userId: hume.id, postId: lockePost2.id, content: 'Чистый эмпиризм. Поддерживаю.' },
      { userId: voltaire.id, postId: leibnizPost1.id, content: 'Лучший из миров? Сомневаюсь.' },
      { userId: descartes.id, postId: leibnizPost2.id, content: 'Время — забавная вещь.' },
      { userId: caligula.id, postId: machiavelliPost1.id, content: 'Истина власти.' },
      { userId: seneca.id, postId: machiavelliPost2.id, content: 'Цель не всегда оправдывает дорогу.' },
      { userId: locke.id, postId: montesquieuPost1.id, content: 'Разделение властей — это будущее.' },
      { userId: rousseau.id, postId: montesquieuPost2.id, content: 'Свобода рождается в законах.' },
      { userId: voltaire.id, postId: rousseauPost1.id, content: 'Жан-Жак, ты опять за своё.' },
      { userId: hume.id, postId: rousseauPost2.id, content: 'Природа сама по себе нейтральна.' },
      { userId: leibniz.id, postId: voltairePost1.id, content: 'Вольтер всегда найдёт что сказать.' },
      { userId: epictetus.id, postId: voltairePost2.id, content: 'Здравый смысл — это работа.' },
    ],
  });

  await prisma.follow.createMany({
    data: [
      { followerId: user.id, followingId: seneca.id },
      { followerId: user.id, followingId: epictetus.id },
      { followerId: user.id, followingId: descartes.id },
      { followerId: seneca.id, followingId: epictetus.id },
      { followerId: epictetus.id, followingId: seneca.id },
      { followerId: caligula.id, followingId: seneca.id },
      { followerId: descartes.id, followingId: hume.id },
      { followerId: hume.id, followingId: locke.id },
      { followerId: locke.id, followingId: hume.id },
      { followerId: leibniz.id, followingId: descartes.id },
      { followerId: machiavelli.id, followingId: caligula.id },
      { followerId: montesquieu.id, followingId: locke.id },
      { followerId: rousseau.id, followingId: voltaire.id },
      { followerId: voltaire.id, followingId: rousseau.id },
      { followerId: voltaire.id, followingId: leibniz.id },
    ],
  });
}

main()
  .catch((error) => {
    console.error('Ошибка при генерации данных:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
