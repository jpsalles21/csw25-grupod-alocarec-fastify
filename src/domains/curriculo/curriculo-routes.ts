import { FastifyInstance } from 'fastify';
import { createCurriculoController, getAllCurriculosController, getCurriculoByIdController, updateCurriculoController, deleteCurriculoController } from './curriculo-controller';
import { verifyJwt } from '../../config/auth';

const curriculoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    nome_curso: { type: 'string' },
    semestre_inicio_vigencia: { type: 'string' },
    semestre_fim_vigencia: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

function verificarAdminOuCoordenador(request: any, reply: any, done: any) {
  const user = request.user;
  if (!user || !user.perfil || (user.perfil.nome !== 'Admin' && user.perfil.nome !== 'Coordenador')) {
    reply.code(403).send({ message: 'Acesso restrito a administradores ou coordenadores.' });
    return;
  }
  done();
}

export default async function curriculoRoutes(fastify: FastifyInstance) {
  // Middleware para autenticação JWT
  fastify.addHook('preHandler', verifyJwt);
    fastify.post('/', { preHandler: verificarAdminOuCoordenador, schema: {
      tags: ['curriculos'],
      summary: 'Criar um novo currículo',
      body: {
        type: 'object',
        required: ['nome_curso', 'semestre_inicio_vigencia', 'semestre_fim_vigencia'],
        properties: {
          nome_curso: { type: 'string' },
          semestre_inicio_vigencia: { type: 'string' },
          semestre_fim_vigencia: { type: 'string' }
        }
      },
      response: {
        201: curriculoSchema
      }
    } }, createCurriculoController);

    fastify.get('/', {
      schema: {
        tags: ['curriculos'],
        summary: 'Listar todos os currículos',
        response: {
          200: {
            type: 'array',
            items: curriculoSchema
          }
        }
      }
    }, getAllCurriculosController);

    fastify.get('/:id', {
      schema: {
        tags: ['curriculos'],
        summary: 'Buscar currículo por ID',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        response: {
          200: curriculoSchema,
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, getCurriculoByIdController);

    fastify.put('/:id', { preHandler: verificarAdminOuCoordenador, schema: {
      tags: ['curriculos'],
      summary: 'Atualizar currículo',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          nome_curso: { type: 'string' },
          semestre_inicio_vigencia: { type: 'string' },
          semestre_fim_vigencia: { type: 'string' }
        }
      },
      response: {
        200: curriculoSchema,
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    } }, updateCurriculoController);

    fastify.delete('/:id', { preHandler: verificarAdminOuCoordenador, schema: {
      tags: ['curriculos'],
      summary: 'Deletar currículo',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: { type: 'null' },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    } }, deleteCurriculoController);
} 