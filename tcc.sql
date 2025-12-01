CREATE DATABASE  IF NOT EXISTS `meu_treino_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meu_treino_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (x86_64)
--
-- Host: localhost    Database: meu_treino_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academia`
--

DROP TABLE IF EXISTS `academia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academia`
--

LOCK TABLES `academia` WRITE;
/*!40000 ALTER TABLE `academia` DISABLE KEYS */;
INSERT INTO `academia` VALUES (1,'Academia Two Paypal',NULL),(2,'teste','teste');
/*!40000 ALTER TABLE `academia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adm`
--

DROP TABLE IF EXISTS `adm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adm` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `adm_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adm`
--

LOCK TABLES `adm` WRITE;
/*!40000 ALTER TABLE `adm` DISABLE KEYS */;
/*!40000 ALTER TABLE `adm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('ea0f3fdd9a18');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aluno`
--

DROP TABLE IF EXISTS `aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aluno` (
  `id_usuario` int NOT NULL,
  `metas` text,
  `peso` float DEFAULT NULL,
  `altura` float DEFAULT NULL,
  `id_academia` int DEFAULT NULL,
  `id_instrutor` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_academia` (`id_academia`),
  KEY `id_instrutor` (`id_instrutor`),
  CONSTRAINT `fk_aluno_academia` FOREIGN KEY (`id_academia`) REFERENCES `academia` (`id`),
  CONSTRAINT `fk_aluno_instrutor` FOREIGN KEY (`id_instrutor`) REFERENCES `instrutor` (`id_usuario`),
  CONSTRAINT `fk_aluno_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aluno`
--

LOCK TABLES `aluno` WRITE;
/*!40000 ALTER TABLE `aluno` DISABLE KEYS */;
INSERT INTO `aluno` VALUES (1,'Migrado do sistema antigo',0,NULL,1,1001),(2,'Migrado do sistema antigo',0,NULL,1,1001),(3,'Migrado do sistema antigo',0,NULL,1,1001),(4,'Migrado do sistema antigo',0,NULL,1,NULL),(6,'Migrado do sistema antigo',0,NULL,1,NULL);
/*!40000 ALTER TABLE `aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `gif_url` varchar(255) DEFAULT NULL,
  `grupo_muscular` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
INSERT INTO `exercicios` VALUES (1,'Supino Reto','https://media1.tenor.com/m/nxJqRDCmt0MAAAAd/supino-reto.gif','Peito'),(2,'Agachamento Livre','https://media1.tenor.com/m/Re3T3B66V9UAAAAd/barbellsquats-gymexercisesmen.gif','Pernas'),(3,'Puxada Frontal','https://image.tuasaude.com/media/article/uh/yp/puxada-frontal_75625.gif?width=1372&height=974','Costas'),(4,'Elevação Lateral','https://media1.tenor.com/m/cy46UbnfUrkAAAAC/eleva%C3%A7%C3%A3o-lateral-hateres.gif','Ombros'),(5,'Rosca Direta','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/dumbbell-biceps-curl.gif','Bíceps'),(6,'Supino Inclinado','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/barbell-incline-bench-press.gif','Peito'),(7,'Supino Declinado','https://www.hipertrofia.org/blog/wp-content/uploads/2018/09/barbell-decline-bench-press.gif','Peito'),(8,'Crucifixo','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/dumbbell-fly.gif','Peito'),(9,'Supino Maquina','https://www.hipertrofia.org/blog/wp-content/uploads/2024/04/lever-chest-press-.gif','Peito'),(10,'Paralelas','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/chest-dip-on-dippullup-cage.gif','Peito'),(11,'Pullover com halteres','https://www.hipertrofia.org/blog/wp-content/uploads/2020/06/dumbbell-pullover.gif','Peito'),(12,'Peck deck','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/lever-seated-fly.gif','Peito'),(13,'Rosca direta com barra','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-direta.gif','Bíceps'),(14,'Rosca direta na polia','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-direta-polia.gif','Bíceps'),(15,'Rosca concentrada','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-concentrada.gif','Bíceps'),(16,'Rosca inclinada','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-inclinada.gif','Bíceps'),(17,'Rosca Spider','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-spider.gif','Bíceps'),(18,'Rosca alternada','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-alternada.gif','Bíceps'),(19,'Barra fixa','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/chinup-1.gif','Costas'),(20,'Rosca Scott','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-scott.gif','Bíceps'),(21,'Rosca Martelo','https://www.hipertrofia.org/blog/wp-content/uploads/2023/04/dumbbell-hammer-curl-v-2.gif','Bíceps'),(22,'Rosca arrastada','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-arrastada.gif','Bíceps'),(23,'Rosca Zottman','https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-zottman.gif','Bíceps'),(24,'Abdominal Reto','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/abdominal-reto.gif','Abdômen'),(25,'Abdominal na Polia','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/abdominal-na-polia.gif','Abdômen'),(26,'Abdominal infra nas paralelas','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-infra-nas-paralelas.gif','Abdômen'),(27,'Prancha Abdominal','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/prancha-1.jpg','Abdômen'),(28,'Abdominal na maquina','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/abdominal-maquina.gif','Abdômen'),(29,'Abdominal Tesoura','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-tesoura.gif','Abdômen'),(30,'Abdominal Remador','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/abdominal-remador.gif','Abdômen'),(31,'Abdominal Infra Solo','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-infra-solo.gif','Abdômen'),(32,'Abdominal Cruzado','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-cruzado.gif','Abdômen'),(33,'Roda Abdmonial','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/abdominal-roda.gif','Abdômen'),(34,'Abdominal Declinado','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-declinado.gif','Abdômen'),(35,'Abdominal oblíquo','https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-lateral.gif','Abdômen'),(36,'Abdominal Invertido','https://www.hipertrofia.org/blog/wp-content/uploads/2024/12/abdominal-infra-solo2.gif','Abdômen'),(37,'Panturrilhas em pé na maquina','https://www.hipertrofia.org/blog/wp-content/uploads/2023/03/lever-standing-calf-raise.gif','Panturrilhas'),(38,'Panturrilha no leg press','https://www.hipertrofia.org/blog/wp-content/uploads/2024/09/sled-calf-press-on-leg-press.gif','Panturrilhas'),(39,'Panturrilha em pé','https://www.hipertrofia.org/blog/wp-content/uploads/2023/07/standing-calf-raise-on-a-staircase.gif','Panturrilhas'),(40,'Panturrilhas com barra livre','https://www.hipertrofia.org/blog/wp-content/uploads/2024/09/barbell-standing-calf-raise.gif','Panturrilhas'),(41,'Panturrilhas sentado na maquina','https://www.hipertrofia.org/blog/wp-content/uploads/2018/10/lever-seated-calf-raise-.gif','Panturrilhas'),(42,'Panturrilha sentado com halter','https://www.hipertrofia.org/blog/wp-content/uploads/2018/10/dumbbell-seated-one-leg-calf-raise-hammer-grip.gif','Panturrilhas');
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrutor`
--

DROP TABLE IF EXISTS `instrutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instrutor` (
  `id_usuario` int NOT NULL,
  `id_academia` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_academia` (`id_academia`),
  CONSTRAINT `fk_instrutor_academia` FOREIGN KEY (`id_academia`) REFERENCES `academia` (`id`),
  CONSTRAINT `fk_instrutor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrutor`
--

LOCK TABLES `instrutor` WRITE;
/*!40000 ALTER TABLE `instrutor` DISABLE KEYS */;
INSERT INTO `instrutor` VALUES (1001,NULL);
/*!40000 ALTER TABLE `instrutor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `conteudo` text NOT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `imagem_url` varchar(255) DEFAULT NULL,
  `id_autor` int NOT NULL,
  `id_academia` int NOT NULL,
  `subtitulo` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_autor` (`id_autor`),
  KEY `id_academia` (`id_academia`),
  CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`id_autor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `noticias_ibfk_2` FOREIGN KEY (`id_academia`) REFERENCES `academia` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (2,'Tudo sobre suplementos alimentares.','Suplementos alimentares são produtos destinados a complementar a dieta normal com nutrientes como vitaminas, minerais, proteínas, aminoácidos, ou outras substâncias com efeito nutricional ou fisiológico. Eles não são medicamentos e não servem para tratar doenças, mas podem ajudar a atingir metas de saúde e desempenho físico quando a alimentação sozinha não é suficiente.\r\n\r\nTipos Comuns: Whey, Creatina, Pré-Treino\r\n\r\nWhey Protein: É a proteína do soro do leite, rapidamente absorvida pelo corpo. Ideal para recuperação muscular pós-treino, ajudando na reparação e crescimento das fibras musculares. Existem diferentes tipos, como concentrado, isolado e hidrolisado.\r\n\r\nCreatina: Um composto natural que ajuda a fornecer energia rápida para os músculos durante exercícios de alta intensidade e curta duração (como levantamento de peso ou sprints). Aumenta a força, a potência e pode auxiliar no ganho de massa muscular.\r\n\r\nPré-Treino: Geralmente uma mistura de ingredientes como cafeína, beta-alanina, aminoácidos e vitaminas, projetada para aumentar a energia, o foco, a resistência e o desempenho durante o treino. Os efeitos variam muito dependendo da fórmula.\r\n\r\nComo e Quando Usar?\r\n\r\nA utilização de suplementos deve ser orientada por um profissional de saúde (nutricionista ou médico). O Whey Protein é comumente consumido após o treino, mas pode ser usado em outros horários para complementar a ingestão proteica. A Creatina geralmente é tomada diariamente (cerca de 3-5g), não necessariamente antes ou depois do treino. O Pré-Treino é consumido cerca de 20-30 minutos antes do exercício. É crucial seguir as dosagens recomendadas e lembrar que suplementos não substituem uma dieta equilibrada.','2025-11-29 09:04:05','https://clinicarevitalize.com.br/public/uploads/noticias/suplementos-alimentares.05-03-2022.11-35-14.jpg',6,1,'O que é Whey, Creatina, Pré-Treino? Descubra como podem ser aliados ao seu treino.'),(3,'O que não fazer durante o Treino?','Muitas vezes, a falta de resultados visíveis ou o surgimento de lesões inesperadas não estão ligados ao que o praticante deixa de fazer, mas sim ao que ele faz de errado. Especialistas em educação física e fisiologia do exercício alertam para hábitos silenciosos que sabotam o desempenho dentro das academias.\r\n\r\nO primeiro grande erro é pular o aquecimento. Muitos alunos chegam na academia e vão direto para os pesos, ignorando que o corpo precisa de uma preparação prévia. O aquecimento, especialmente o de mobilidade e o específico com cargas leves, é fundamental para lubrificar as articulações e sinalizar ao sistema nervoso central que uma atividade intensa irá começar. Sem isso, o risco de lesão aumenta drasticamente.\r\n\r\nOutro vilão comum é priorizar a carga em detrimento da técnica, prática conhecida como \"ego lifting\". Tentar levantar mais peso do que a musculatura suporta compromete a amplitude do movimento e obriga o corpo a recrutar músculos auxiliares de forma errada para compensar a força. É preciso lembrar que o músculo responde à tensão e à execução correta, e não apenas ao número impresso na anilha.\r\n\r\nPor fim, os descansos excessivos, muitas vezes causados pelo uso do celular, também prejudicam o treino. Passar muito tempo entre uma série e outra faz com que o corpo esfrie e a frequência cardíaca caia, perdendo a intensidade metabólica necessária para gerar resultados. Manter o foco e respeitar o cronômetro é essencial para a eficácia do exercício.','2025-11-29 10:39:42','https://ichef.bbci.co.uk/ace/ws/240/cpsprodpb/25BE/production/_125026690_gettyimages-674772582.jpg.webp',6,1,'Conheça os erros mais comuns durante o Treino. Será que você está cometendo?'),(4,'Como descansar corretamente após o Treino?','Existe uma máxima no mundo do fitness que diz: \"o treino estimula, mas é o descanso que constrói\". É durante o período de repouso que as fibras musculares, microlesionadas durante o exercício, se regeneram e crescem. No entanto, descansar não significa apenas inatividade; existem estratégias ativas para otimizar esse processo.\r\n\r\nA técnica mais importante, segundo especialistas, é o protocolo da \"janela de sono\". Não há suplementação que substitua uma boa noite de descanso. É durante o sono profundo que ocorre o pico de liberação do hormônio do crescimento (GH) e a regulação do cortisol. Recomenda-se entre sete a nove horas de sono em ambiente escuro para garantir a recuperação completa do sistema nervoso e muscular.\r\n\r\nPara quem sofre com dores musculares tardias, a recuperação ativa é uma excelente aliada. Ao invés de ficar totalmente parado, realizar atividades de baixíssima intensidade — como uma caminhada leve, alongamentos suaves ou yoga — ajuda a aumentar o fluxo sanguíneo. Esse sangue extra transporta nutrientes para os músculos e auxilia na remoção de toxinas metabólicas, como o ácido lático residual.\r\n\r\nAlém disso, o controle térmico pode ser utilizado estrategicamente. O uso de gelo (crioterapia) é indicado para inflamações agudas logo após treinos muito intensos, enquanto o calor ajuda no relaxamento muscular e no alívio de tensões. Aliado a uma alimentação rica em proteínas para reparação tecidual e carboidratos para reposição de energia, o descanso torna-se a ferramenta mais poderosa para a evolução física.','2025-11-29 10:40:36','https://s2-ge.glbimg.com/DK7GTmxCLOHCfPZ1Sv13qadmkZo=/0x0:724x483/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2018/9/T/NyBezyQR2uhNBPikGWew/istock-513595340.jpg',6,1,'Descubra Técnicas recomendada por especialistas para fazer no pós-treino e como amenizar a dor muscular.');
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_itens`
--

DROP TABLE IF EXISTS `registro_itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registro_id` int NOT NULL,
  `exercicio_id` int NOT NULL,
  `concluido` tinyint(1) DEFAULT '0',
  `carga_kg` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `registro_id` (`registro_id`),
  KEY `exercicio_id` (`exercicio_id`),
  CONSTRAINT `registro_itens_ibfk_1` FOREIGN KEY (`registro_id`) REFERENCES `registros_treino` (`id`) ON DELETE CASCADE,
  CONSTRAINT `registro_itens_ibfk_2` FOREIGN KEY (`exercicio_id`) REFERENCES `exercicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_itens`
--

LOCK TABLES `registro_itens` WRITE;
/*!40000 ALTER TABLE `registro_itens` DISABLE KEYS */;
/*!40000 ALTER TABLE `registro_itens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_treino`
--

DROP TABLE IF EXISTS `registros_treino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_treino` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `user_id` int NOT NULL,
  `treino_id` int NOT NULL,
  `duracao_segundos` int DEFAULT '0',
  `status` varchar(20) DEFAULT 'concluido',
  PRIMARY KEY (`id`),
  KEY `treino_id` (`treino_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `registros_treino_ibfk_1` FOREIGN KEY (`treino_id`) REFERENCES `treinos` (`id`),
  CONSTRAINT `registros_treino_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_treino`
--

LOCK TABLES `registros_treino` WRITE;
/*!40000 ALTER TABLE `registros_treino` DISABLE KEYS */;
/*!40000 ALTER TABLE `registros_treino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treino_exercicio`
--

DROP TABLE IF EXISTS `treino_exercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treino_exercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `treino_id` int NOT NULL,
  `exercicio_id` int NOT NULL,
  `series` varchar(50) DEFAULT NULL,
  `repeticoes` varchar(50) DEFAULT NULL,
  `descanso_seg` int DEFAULT NULL,
  `peso` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercicio_id` (`exercicio_id`),
  KEY `treino_id` (`treino_id`),
  CONSTRAINT `treino_exercicio_ibfk_1` FOREIGN KEY (`exercicio_id`) REFERENCES `exercicios` (`id`),
  CONSTRAINT `treino_exercicio_ibfk_2` FOREIGN KEY (`treino_id`) REFERENCES `treinos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treino_exercicio`
--

LOCK TABLES `treino_exercicio` WRITE;
/*!40000 ALTER TABLE `treino_exercicio` DISABLE KEYS */;
INSERT INTO `treino_exercicio` VALUES (14,8,22,'3','12',60,'10kg'),(15,8,5,'3','5',60,'20kg'),(16,8,22,'3','12',60,'20'),(17,9,19,'5','12',1000,'1kg'),(23,14,15,'3','12',60,'30kg');
/*!40000 ALTER TABLE `treino_exercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treinos`
--

DROP TABLE IF EXISTS `treinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treinos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `dia` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `treinos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treinos`
--

LOCK TABLES `treinos` WRITE;
/*!40000 ALTER TABLE `treinos` DISABLE KEYS */;
INSERT INTO `treinos` VALUES (8,'foco em pinto','Quarta-feira',4),(9,'testezao','Segunda-feira',4),(14,'teste','Segunda-feira',6);
/*!40000 ALTER TABLE `treinos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `senha_hash` varchar(256) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `cargo` enum('aluno','instrutor','adm') NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Usuário Insomnia','insomnia@email.com','$2b$12$2IUSQcT4VrJGOkY8aALuq.iyvlwI8oNHUJQvz.jz5h4e2m02EPeca','','aluno',NULL),(2,'jose','jose.jose@gmail.com','$2b$12$Emh/0.vcS4BCXovR/B.clOHqTykLdUxi1zBiNWfl8D5mCTJuZ3HWa','','aluno',NULL),(3,'bolsonaro','jair.bolsonaro@gmail.com','$2b$12$D6kQyXSZLlUfd8SkB8IqwO444priXdA0dhQgYfzhh6sjblIx5EkpC','','aluno',NULL),(4,'testeEnzo','testeenzo@gmail.com','$2b$12$Cq9Q0svLZ3hJtD2wHNQ43.WfImeZ38NqxRO0yxTaiiieBt3G./mJy','','instrutor',NULL),(6,'gabriel','testegabriel@gmail.com','$2b$12$aDNk1j3e4Ncy6LMbGJ7cLuxURM7EQbxkmsfRBrplJSq4owy2Hy1AG','','adm',NULL),(1001,'Instrutor teste','instrutor@gmail.com','$2b$12$i9SCs6hnKbk4LOkfL3sXM.a56idWDCTxQ9S3dC24scgbqbp2lp93S','11912082121','instrutor',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'meu_treino_db'
--

--
-- Dumping routines for database 'meu_treino_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 16:27:13
