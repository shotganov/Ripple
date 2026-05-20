import { NotificationType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "reports", "messages", "chats", "likes", "comments", "follows", "notifications", "posts", "users" RESTART IDENTITY CASCADE',
  );

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'Администратор',
      tag: 'admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      bio: 'Главный администратор платформы',
      avatar: 'default.jpg',
    },
  });

  const seneca = await prisma.user.create({ data: { username: 'Сенека', tag: 'seneca', email: 'seneca@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Римский философ-стоик', avatar: 'seneka.png', createdAt: daysAgo(30) } });
  const epictetus = await prisma.user.create({ data: { username: 'Эпиктет', tag: 'epictetus', email: 'epictetus@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Греческий философ-стоик', avatar: 'epictetus.png', createdAt: daysAgo(28) } });
  const caligula = await prisma.user.create({ data: { username: 'Калигула', tag: 'caligula', email: 'caligula@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Римский император и философ', avatar: 'kaligula.png', createdAt: daysAgo(25) } });
  const descartes = await prisma.user.create({ data: { username: 'Рене Декарт', tag: 'descartes', email: 'descartes@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Французский философ и математик', avatar: 'decart.jpg', createdAt: daysAgo(22) } });
  const hume = await prisma.user.create({ data: { username: 'Дэвид Юм', tag: 'hume', email: 'hume@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Шотландский философ-эмпирик', avatar: 'hume.jpg', createdAt: daysAgo(19) } });
  const locke = await prisma.user.create({ data: { username: 'Джон Локк', tag: 'locke', email: 'locke@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Английский философ, основатель либерализма', avatar: 'john_lokk.jpg', createdAt: daysAgo(16) } });
  const leibniz = await prisma.user.create({ data: { username: 'Готфрид Лейбниц', tag: 'leibniz', email: 'leibniz@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Немецкий философ и математик', avatar: 'leibniz.jpg', createdAt: daysAgo(13) } });
  const machiavelli = await prisma.user.create({ data: { username: 'Никколо Макиавелли', tag: 'machiavelli', email: 'machiavelli@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Итальянский мыслитель эпохи Возрождения', avatar: 'makiavelli.jpg', createdAt: daysAgo(10) } });
  const montesquieu = await prisma.user.create({ data: { username: 'Шарль Монтескье', tag: 'montesquieu', email: 'montesquieu@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Французский философ-просветитель', avatar: 'montesquieu.jpg', createdAt: daysAgo(7) } });
  const rousseau = await prisma.user.create({ data: { username: 'Жан-Жак Руссо', tag: 'rousseau', email: 'rousseau@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Французский мыслитель эпохи Просвещения', avatar: 'russo.jpg', createdAt: daysAgo(5) } });
  const voltaire = await prisma.user.create({ data: { username: 'Вольтер', tag: 'voltaire', email: 'voltaire@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Французский философ-просветитель и писатель', avatar: 'volter.jpg', createdAt: daysAgo(3) } });
  const user = await prisma.user.create({ data: { username: 'Пользователь', tag: 'user', email: 'user@example.com', role: Role.USER, passwordHash: hashedPassword, bio: 'Тестовый пользователь', avatar: 'default.jpg', createdAt: daysAgo(1) } });

  await prisma.post.createMany({
    data: [
      {
        userId: voltaire.id,
        content: 'Рим, Петербург, Париж — камень не лжёт. Цивилизацию измеряют не законами, а тем, что остаётся после их забвения. Я объездил достаточно, чтобы знать: архитектура — единственная философия, доступная всем.',
        images: ['rim.jpg', 'piter.jpg', 'piter1.jpg', 'gotica.jpg'],
        createdAt: hoursAgo(1),
      },
      {
        userId: epictetus.id,
        content: 'Мудрец не раб желудка. Если ты не можешь отказаться от сладкого, как ты откажешься от страха, гнева и тщеславия? Начни с тарелки.',
        images: ['dessert.jpg', 'pot-mussels.jpg', 'fish-vegetables.jpg'],
        createdAt: hoursAgo(2),
      },
      {
        userId: machiavelli.id,
        content: 'Государь должен выглядеть так, чтобы внушать уважение прежде, чем откроет рот. Хорошая кожа и быстрый экипаж — не роскошь, а инструмент власти.',
        images: ['leather-bag-gray.jpg', 'car-interior-design.jpg'],
        createdAt: hoursAgo(3),
      },
      {
        userId: descartes.id,
        content: 'Cogito, ergo sum — но всё же я задаюсь вопросом: что из этих вещей существует на самом деле, а что лишь в моём воображении? Протяжённость и форма — вот что неопровержимо. Остальное — иллюзия чувств.',
        images: ['accessories-bag.jpg'],
        createdAt: hoursAgo(4),
      },
    ],
  });

  const postDefs = [
    { userId: seneca.id, content: 'Человек, которого застеклённые окна защищали от малейшего дуновения, подвергается смертельной опасности, даже если его коснётся самый лёгкий ветерок.', daysAgo: 29 },
    { userId: seneca.id, content: 'Говорят, что Гай Цезарь отличался помимо прочих немалочисленных своих пороков каким-то удивительным сладострастием в оскорблениях.', daysAgo: 27 },
    { userId: seneca.id, content: 'Измени своё мнение, если оно ошибочно.', daysAgo: 24 },
    { userId: epictetus.id, content: 'Не тот беден, кто имеет мало, а тот, кто хочет иметь больше.', daysAgo: 22 },
    { userId: epictetus.id, content: 'Познай самого себя.', daysAgo: 20 },
    { userId: caligula.id, content: 'Счастье вашей жизни зависит от качества ваших мыслей.', daysAgo: 18 },
    { userId: descartes.id, content: 'Cogito, ergo sum. Мыслю, следовательно, существую.', daysAgo: 17 },
    { userId: descartes.id, content: 'Чтобы найти истину, необходимо хоть раз в жизни усомниться во всём, насколько это возможно.', daysAgo: 15 },
    { userId: hume.id, content: 'Привычка — великий руководитель в человеческой жизни. Только она делает наш опыт полезным.', daysAgo: 14 },
    { userId: hume.id, content: 'Разум есть и должен быть лишь рабом страстей.', daysAgo: 12 },
    { userId: locke.id, content: 'Все люди по природе равны и свободны. Никто не может лишить другого жизни, здоровья, свободы или собственности.', daysAgo: 11 },
    { userId: locke.id, content: 'Ум подобен чистому листу — опыт пишет на нём.', daysAgo: 9 },
    { userId: leibniz.id, content: 'Мы живём в лучшем из возможных миров.', daysAgo: 8 },
    { userId: leibniz.id, content: 'Настоящее чревато будущим, а прошлое присутствует в настоящем.', daysAgo: 7 },
    { userId: machiavelli.id, content: 'Лучше, чтобы тебя боялись, чем любили — если уж нельзя совместить и то и другое.', daysAgo: 6 },
    { userId: machiavelli.id, content: 'Цель оправдывает средства, но не всегда оправдывает того, кто их выбрал.', daysAgo: 5 },
    { userId: montesquieu.id, content: 'Чтобы не злоупотребляли властью, необходим такой порядок вещей, при котором различные власти могли бы взаимно сдерживать друг друга.', daysAgo: 4 },
    { userId: montesquieu.id, content: 'Свобода есть право делать всё, что дозволено законами.', daysAgo: 3 },
    { userId: rousseau.id, content: 'Человек рождается свободным, но повсюду он в оковах.', daysAgo: 2 },
    { userId: rousseau.id, content: 'Природа создала человека счастливым и добрым, но общество искажает его и делает несчастным.', daysAgo: 2 },
    { userId: voltaire.id, content: 'Я не согласен с тем, что вы говорите, но готов умереть за ваше право это говорить.', daysAgo: 1 },
    { userId: voltaire.id, content: 'Здравый смысл — не такая уж распространённая вещь.', daysAgo: 0 },
    { userId: user.id, content: 'Только начинаю разбираться в философии. Кто из мыслителей вам ближе всего?', daysAgo: 0 },
    { userId: user.id, content: 'Прочитал Сенеку — многое переосмыслил. Рекомендую всем.', daysAgo: 1 },
  ];

  const posts = await Promise.all(
    postDefs.map(({ daysAgo: n, ...data }) =>
      prisma.post.create({ data: { ...data, createdAt: daysAgo(n) } }),
    ),
  );

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
    userPost1,
    userPost2,
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
      const candidate =
        philosophers[Math.floor(Math.random() * philosophers.length)];
      if (candidate.id !== post.userId) liked.add(candidate.id);
    }
    liked.forEach((userId) => likeData.push({ userId, postId: post.id }));
  }
  await prisma.like.createMany({ data: likeData });

  await prisma.comment.createMany({
    data: [
      { userId: epictetus.id, postId: senecaPost1.id, content: 'Мудро сказано, друг.', createdAt: daysAgo(28) },
      { userId: caligula.id, postId: senecaPost1.id, content: 'Очень актуально в наше время.', createdAt: daysAgo(27) },
      { userId: descartes.id, postId: senecaPost3.id, content: 'Сомнение — путь к истине.', createdAt: daysAgo(24) },
      { userId: voltaire.id, postId: senecaPost2.id, content: 'Тираны во все времена одинаковы.', createdAt: daysAgo(23) },
      { userId: seneca.id, postId: epictetusPost1.id, content: 'Согласен на 100%.', createdAt: daysAgo(21) },
      { userId: machiavelli.id, postId: epictetusPost1.id, content: 'Богатство — иллюзия власти.', createdAt: daysAgo(20) },
      { userId: locke.id, postId: epictetusPost2.id, content: 'Самопознание начинается с опыта.', createdAt: daysAgo(18) },
      { userId: rousseau.id, postId: caligulaPost1.id, content: 'Качество мыслей определяет свободу.', createdAt: daysAgo(17) },
      { userId: hume.id, postId: descartesPost1.id, content: 'А существует ли это самое «я»?', createdAt: daysAgo(15) },
      { userId: leibniz.id, postId: descartesPost1.id, content: 'Гениально и просто.', createdAt: daysAgo(14) },
      { userId: epictetus.id, postId: descartesPost2.id, content: 'Сомнение очищает разум.', createdAt: daysAgo(13) },
      { userId: locke.id, postId: humePost1.id, content: 'Опыт — источник всякого знания.', createdAt: daysAgo(11) },
      { userId: descartes.id, postId: humePost2.id, content: 'Тут я с вами поспорю, Дэвид.', createdAt: daysAgo(10) },
      { userId: voltaire.id, postId: lockePost1.id, content: 'Это и есть основа свободы.', createdAt: daysAgo(9) },
      { userId: rousseau.id, postId: lockePost1.id, content: 'А оковы общества тогда откуда?', createdAt: daysAgo(8) },
      { userId: hume.id, postId: lockePost2.id, content: 'Чистый эмпиризм. Поддерживаю.', createdAt: daysAgo(7) },
      { userId: voltaire.id, postId: leibnizPost1.id, content: 'Лучший из миров? Сомневаюсь.', createdAt: daysAgo(6) },
      { userId: descartes.id, postId: leibnizPost2.id, content: 'Время — забавная вещь.', createdAt: daysAgo(5) },
      { userId: caligula.id, postId: machiavelliPost1.id, content: 'Истина власти.', createdAt: daysAgo(4) },
      { userId: seneca.id, postId: machiavelliPost2.id, content: 'Цель не всегда оправдывает дорогу.', createdAt: daysAgo(4) },
      { userId: locke.id, postId: montesquieuPost1.id, content: 'Разделение властей — это будущее.', createdAt: daysAgo(3) },
      { userId: rousseau.id, postId: montesquieuPost2.id, content: 'Свобода рождается в законах.', createdAt: daysAgo(2) },
      { userId: voltaire.id, postId: rousseauPost1.id, content: 'Жан-Жак, ты опять за своё.', createdAt: daysAgo(2) },
      { userId: hume.id, postId: rousseauPost2.id, content: 'Природа сама по себе нейтральна.', createdAt: daysAgo(1) },
      { userId: leibniz.id, postId: voltairePost1.id, content: 'Вольтер всегда найдёт что сказать.', createdAt: daysAgo(1) },
      { userId: epictetus.id, postId: voltairePost2.id, content: 'Здравый смысл — это работа.', createdAt: daysAgo(0) },
      { userId: seneca.id, postId: userPost1.id, content: 'Хороший вопрос. Мне ближе всего стоицизм.', createdAt: daysAgo(0) },
      { userId: voltaire.id, postId: userPost1.id, content: 'Советую начать с Вольтера — не пожалеешь.', createdAt: daysAgo(0) },
      { userId: epictetus.id, postId: userPost2.id, content: 'Сенека — лучший выбор для начала.', createdAt: daysAgo(1) },
    ],
  });

  const followData = [
    { followerId: user.id, followingId: seneca.id },
    { followerId: user.id, followingId: epictetus.id },
    { followerId: user.id, followingId: descartes.id },
    { followerId: seneca.id, followingId: user.id },
    { followerId: voltaire.id, followingId: user.id },
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
  ];
  await prisma.follow.createMany({ data: followData });

  // Notifications
  const postOwnerMap = new Map(posts.map((p) => [p.id, p.userId]));

  // LIKE notifications
  const likeNotifications = likeData
    .filter(({ userId: actorId, postId }) => postOwnerMap.get(postId) !== actorId)
    .map(({ userId: actorId, postId }) => ({
      recipientId: postOwnerMap.get(postId)!,
      actorId,
      type: NotificationType.LIKE,
      postId,
    }));

  // COMMENT notifications — fetch created comments to get their ids
  const createdComments = await prisma.comment.findMany({
    where: { postId: { in: posts.map((p) => p.id) } },
    select: { id: true, postId: true, userId: true },
  });
  const commentNotifications = createdComments
    .filter(({ userId: actorId, postId }) => postOwnerMap.get(postId) !== actorId)
    .map(({ id: commentId, postId, userId: actorId }) => ({
      recipientId: postOwnerMap.get(postId)!,
      actorId,
      type: NotificationType.COMMENT,
      postId,
      commentId,
    }));

  // FOLLOW notifications
  const followNotifications = followData.map(({ followerId, followingId }) => ({
    recipientId: followingId,
    actorId: followerId,
    type: NotificationType.FOLLOW,
  }));

  await prisma.notification.createMany({
    data: [...likeNotifications, ...commentNotifications, ...followNotifications],
    skipDuplicates: true,
  });

  // Chats
  const chatUserSeneca = await prisma.chat.create({
    data: { user1Id: user.id, user2Id: seneca.id },
  });
  const chatUserVoltaire = await prisma.chat.create({
    data: { user1Id: user.id, user2Id: voltaire.id },
  });
  const chatUserEpictetus = await prisma.chat.create({
    data: { user1Id: user.id, user2Id: epictetus.id },
  });

  await prisma.message.createMany({
    data: [
      // user ↔ seneca
      { chatId: chatUserSeneca.id, senderId: user.id, content: 'Сенека, как ты справляешься с тревогой?', isRead: true, createdAt: daysAgo(3) },
      { chatId: chatUserSeneca.id, senderId: seneca.id, content: 'Ищи причину тревоги внутри, а не снаружи. Страх — это иллюзия.', isRead: true, createdAt: daysAgo(3) },
      { chatId: chatUserSeneca.id, senderId: user.id, content: 'Легко сказать... Попробую твой совет.', isRead: true, createdAt: daysAgo(2) },
      { chatId: chatUserSeneca.id, senderId: seneca.id, content: 'Практикуй каждый день. Стоицизм — это навык, а не теория.', isRead: false, createdAt: daysAgo(1) },
      { chatId: chatUserSeneca.id, senderId: seneca.id, content: 'Как успехи?', isRead: false, createdAt: hoursAgo(3) },

      // user ↔ voltaire
      { chatId: chatUserVoltaire.id, senderId: voltaire.id, content: 'Слышал, ты читаешь философию. С чего начал?', isRead: true, createdAt: daysAgo(2) },
      { chatId: chatUserVoltaire.id, senderId: user.id, content: 'Начал с Сенеки. Очень нравится.', isRead: true, createdAt: daysAgo(2) },
      { chatId: chatUserVoltaire.id, senderId: voltaire.id, content: 'Неплохо. Но после него обязательно прочти Просвещение.', isRead: true, createdAt: daysAgo(1) },
      { chatId: chatUserVoltaire.id, senderId: voltaire.id, content: 'Я могу порекомендовать список литературы.', isRead: false, createdAt: hoursAgo(5) },

      // user ↔ epictetus
      { chatId: chatUserEpictetus.id, senderId: epictetus.id, content: 'Привет! Видел твой вопрос в ленте.', isRead: true, createdAt: daysAgo(1) },
      { chatId: chatUserEpictetus.id, senderId: user.id, content: 'Да, хочу разобраться в стоицизме.', isRead: true, createdAt: daysAgo(1) },
      { chatId: chatUserEpictetus.id, senderId: epictetus.id, content: 'Главный принцип: разделяй то, что в твоей власти, и то, что нет.', isRead: true, createdAt: hoursAgo(10) },
      { chatId: chatUserEpictetus.id, senderId: epictetus.id, content: 'Это меняет отношение ко всему.', isRead: false, createdAt: hoursAgo(2) },
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
