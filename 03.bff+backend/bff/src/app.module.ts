import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { GraphqlModule } from "./graphql/graphql.module";
import { ApiModule } from "./generated";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    GraphqlModule,
    ApiModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "graphql-view"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
