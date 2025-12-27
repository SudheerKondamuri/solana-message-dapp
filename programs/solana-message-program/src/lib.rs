use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;
pub mod state;
pub mod constants;
pub mod error;

declare_id!("DyhyE5QYFksFcLrHwQBkTxrecmmNtYgjmBht6Qmp1q6u");

#[program]
pub mod solana_message_program {
    use super::*;

    
    pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()> {
        instructions::initialize::handler(ctx, message)
    }

    pub fn update(ctx: Context<Update>, new_message: String) -> Result<()> {
        let account = &mut ctx.accounts.message_account;
        account.message = new_message;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = authority)]
    pub message_account: Account<'info, MessageAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct MessageAccount {
    pub authority: Pubkey,
    pub message: String,
}